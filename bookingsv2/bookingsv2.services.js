const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBooking = async (newBooking) => {
  const car = await prisma.cars.findUnique({
    where: {
      car_id: newBooking.car_id,
    },
  });

  if (!car) {
    throw new Error("Mobil tidak ditemukan.");
  }

  // if (car.status !== 'Available') {
  //   throw new Error("Mobil tidak tersedia.");
  // }

  const booking = await prisma.booking.create({
    data: {
      car_id: newBooking.car_id,
      user_id: newBooking.user_id,
      start_date: new Date(newBooking.start_date).toISOString(),
      end_date: new Date(newBooking.end_date).toISOString(),
      duration: newBooking.duration,
      total_price: newBooking.total_price,
      status_pelunasan: 'Pending',  
    },
  });

  return booking;
};

const getAllBookingHistory = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      car: {
        select: {
          car_id: true,
          title: true,
        },
      },
      user: {
        select: {
          user_id: true,
          name: true,
        },
      },
      payment: true,
    },
    orderBy: {
      start_date: 'desc',
    },
  });

  return bookings;
};

const getBookingHistory = async (userId) => {
    const bookings = await prisma.booking.findMany({
      where: {
        user_id: userId,
      },
      include: {
        car: true,
        payment: true,
      },
      orderBy: {
        start_date: 'desc',
      },
    });
  
    return bookings;
  };



// const getBookingDetail = async (bookingId) => {
//   const booking = await prisma.booking.findUnique({
//     where: {
//       booking_id: bookingId,
//     },
//     include: {
//       car: true,
//       user: true,
//       payment: true,
//     },
//   });

//   return booking;
// };

const checkAvailability = async (carId, startDate, endDate) => {
    const bookings = await prisma.booking.findMany({
      where: {
        car_id: carId,
        status_pelunasan: 'Completed',
        OR: [
          {
            start_date: {
              lte: new Date(endDate),
            },
            end_date: {
              gte: new Date(startDate),
            },
          },
          {
            start_date: {
              lte: new Date(startDate),
            },
            end_date: {
              gte: new Date(endDate),
            },
          },
        ],
      },
    });
  
    return bookings.length === 0;
  };

  const calculateTotalRevenue = async () => {
    const payments = await prisma.payment.findMany({
        where: {
            status_pembayaran: 'Completed',
        },
        include: {
          booking: {
            include: {
              car: true
            }
          }
        }
    });

    const totalRevenue = payments.reduce((total, payment) => {
      return total + payment.booking.total_price;
  }, 0);

  return totalRevenue;
};

  const getRecentBookings = async () => {
    const recentBookings = await prisma.booking.findMany({
      include: {
        car: {
          select: {
            car_id: true,
            title: true,
          },
        },
        user: {
          select: {
            user_id: true,
            name: true,
          },
        },
      },
      orderBy: {
        start_date: 'desc',
      },
      take: 5,
    });
  
    return recentBookings;
  };
  


module.exports = {
  createBooking,
  checkAvailability,
  getBookingHistory,
  getAllBookingHistory,
  calculateTotalRevenue,
  getRecentBookings

};