const { PrismaClient } = require('@prisma/client');
const { sendInvoiceBooking } = require('../config/sendInvoiceBooking');
const prisma = new PrismaClient();



const createPayment = async (paymentData) => {
    const bookingId = parseInt(paymentData.booking_id)
    const booking = await prisma.booking.findUnique({
        where: {
            booking_id: bookingId,
        },
        include: {
            car: true,
            user: true,
        },
    });

    if (!booking) {
        throw new Error("Booking tidak ditemukan.");
    }

    const payment = await prisma.payment.create({
        data: {
            booking_id: bookingId,
            img_transcation: paymentData.img_transcation,
            img_ktp: paymentData.img_ktp,
            img_sim: paymentData.img_sim,
        },
    });

    await prisma.cars.update({
        where: {
            car_id: booking.car_id,
        },
        data: {
            status: 'Unavailable',
        },
    });

    await prisma.booking.update({
        where: {
            booking_id: paymentData.booking_id,
        },
        data: {
            status_pelunasan: 'Menunggu Konfirmasi',
        },
    });

    // const user_email = booking.user.email;
    // const car_title = booking.car.title;
    // const amount = booking.total_price;
    // const img_transcation = paymentData.img_transcation;
    // const startDate = booking.start_date;
    // const endDate = booking.end_date;
    // const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    // const rentalPrice = booking.total_price / duration;

    // await sendInvoiceBooking(user_email, car_title, amount, img_transcation , startDate, endDate, duration, rentalPrice);
    
    return payment;
};

const getAllPaymentHistory = async () => {
    const payments = await prisma.payment.findMany({
        include: {
            booking: {
                include: {
                    car: true,
                    user: true,
                },
            },
        },
    });

    return payments;
};

const updateStatusPayment = async (paymentId, status) => {
    const payment = await prisma.payment.findUnique({
        where: {
            payment_id: paymentId,
        },
        include: {
            booking: {
                include: {
                    car: true,
                    user: true,
                },
            }
        }
    });

    if (!payment) {
        throw new Error("Payment tidak ditemukan.");
    }

    const updatedPayment = await prisma.payment.update({
        where: {
            payment_id: paymentId,
        },
        data: {
            status_pembayaran: status,
        },
    });

    if (status === "Completed") {
        const user_email = payment.booking.user.email;
        const car_title = payment.booking.car.title;
        const amount = payment.booking.total_price;
        const img_transcation = payment.img_transcation;
        const startDate = payment.booking.start_date;
        const endDate = payment.booking.end_date;
        const duration = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const rentalPrice = payment.booking.total_price / duration;

        // Update status pelunasan booking
        await prisma.booking.update({
            where: {
                booking_id: payment.booking.booking_id,
            },
            data: {
                status_pelunasan: 'Completed',
            },
        });

        setImmediate(() => {
            sendInvoiceBooking(user_email, car_title, amount, img_transcation, startDate, endDate, duration, rentalPrice);
        });
        
        // Function to send notification to the client (could be via WebSocket or any other mechanism)
        sendNotification(user_email, "Pembayaran anda telah lunas, silahkan cek email untuk detail booking. Terima kasih!");
        
        
    } else if (status === "Cancel") {
        // Update status pelunasan booking
        await prisma.booking.update({
            where: {
                booking_id: payment.booking.booking_id,
            },
            data: {
                status_pelunasan: 'Cancel',
            },
        });
    }

    return updatedPayment;

}

const sendNotification = (user_email, message) => {
    // Your logic to send notification
    console.log(`Notification sent to ${user_email}: ${message}`);
    
}

const getDataByMonth = async (month) => {
    const year = new Date().getFullYear();
    let startDate, endDate;

    if (month) {
        startDate = new Date(`${year}-${month}-01`);
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Menambah satu bulan
    }

    const whereClause = month
      ? {
          booking: {
            start_date: {
              gte: startDate,
              lt: endDate,
            },
          },
        }
      : {};

    const payments = await prisma.payment.findMany({
        where: whereClause,
        include: {
            booking: {
                include: {
                    car: true,
                    user: true,
                },
            },
        },
    });

    return payments;

}


module.exports = {
    createPayment,
    getAllPaymentHistory,
    updateStatusPayment,
    getDataByMonth
}