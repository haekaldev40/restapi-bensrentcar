const { sendInvoiceBooking } = require('../config/sendInvoiceBooking.js')
const prisma = require('../database/index.js')

const findPayment = async () => {
    const payment = await prisma.payment.findMany()
    return payment
}

const findPaymentById = async (payment_id) => {
    const payment = await prisma.payment.findUnique({
        where: {
            payment_id: payment_id
        },
        include: {
            booking: {
                select: {
                    car: {
                        select: {
                            title: true
                        }
                    },
                    user: {
                        select: {
                            email: true
                        }
                    }
                }
            }
        }
    })

    if (!payment) {
        throw new Error('Payment not found')
    }
    return payment;
}

const createPayment = async (booking_id, img_transcation, amount) => {
    const booking = await prisma.booking.findUnique({
        where: {
            booking_id: booking_id
        },
        include: {
            user: true,
            car: true
        }
    })

    if (!booking) {
        throw new Error('Booking not found')
    }

    const payment = await prisma.payment.create({
        data: {
            booking_id: booking_id,
            img_transcation: img_transcation,
            amount: amount
        }
    })

    await sendInvoiceBooking(booking.user.email, booking.car.title, amount, img_transcation);

    await prisma.booking.update({
        where: {
            booking_id: booking_id
        },
        data: {
            status: 'Success'
        }
    })

    await prisma.cars.update({
        where: {
            car_id: booking.car_id
        },
        data: {
            status: 'Unavailable'
        }
    })

    return payment;
}

// const completePayment = async (booking_id, img_transcation, amount) => {
//     const payment = await prisma.payment.findFirst({
//         where: {
//             booking_id: booking_id
//         }
//     })

//     if(!payment) {
//         throw new Error('Payment not found')
//     }
//     // Update Payment

//     await prisma.payment.update({
//         where: {
//             payment_id: payment.payment_id
//         },
//         data: {
//             img_transcation: img_transcation,
//             amount: amount
//         }
//     })

//     const booking = await prisma.booking.findUnique({
//         where: {
//             booking_id: booking_id
//         },
//         include: {
//             car: true
//         }
//     })

//     if(!booking) {
//         throw new Error('Booking not found')
//     }

//     await prisma.cars.update({
//         where: {
//             car_id: booking.car_id
//         },
//         data: {
//             status: 'Unavailable'
//         }
//     })
// }

const deletePayment = async (payment_id) => {

    const payment = await prisma.payment.findUnique({
        where: {
            payment_id: payment_id
        }
    })

    if(!payment) {
        throw new Error('Payment not found')
    }
    await prisma.payment.delete({
        where: {
            payment_id: payment_id
        }
    })
}



module.exports = {
    findPayment,
    createPayment,
    deletePayment,
    findPaymentById
}