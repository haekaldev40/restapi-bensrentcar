// const prisma = require('../database/index.js');

// const getAllBooking = async () => {
//     const bookings = await prisma.booking.findMany({
//         include: {
//             car: {
//                 select: {
//                     title: true,
//                     price: true
//                 }
//             },
//             user: {
//                 select: {
//                     email: true,
//                 }
//             },
//             destination: {
//                 select: {
//                     name: true,
//                     price: true
//                 }
//             }
//         }
//     });
//     return bookings;
// }

// const newBooking = async (datas) => {
//     const booking = await prisma.booking.create({
//         data: {
//             car_id: datas.car_id,
//             user_id: datas.user_id,
//             start_date: datas.start_date,
//             end_date: datas.end_date,
//             duration: datas.duration,
//             total_price: datas.total_price,
//             total_dp: datas.total_dp
//         }
//     });
//     return booking;
// }

// // const newBooking = async (car_id, user_id, start_date, end_date, duration, total_price, total_dp, status) => {
// //     // Dicek apakah mobilnya tersedia?
// //     const bookingCar = await prisma.cars.findUnique({
// //         where: {
// //             car_id: car_id
// //         },
// //         // Objek yang dikembalikan harus mencakup data bookings.
// //         // Karena di schema.prisma data booking harus dikembalikan.
// //         include: {
// //             booking: true
// //         }
// //     })

// //     if (!bookingCar) {
// //         throw new Error("Car not found");
// //       }
    
// //       if (bookingCar.status !== 'Available') {
// //         throw new Error("Car is not available for booking");
// //       }

// //     // Lalu jika sudah tersedia, buat booking.
// //       const booking = await prisma.booking.create({
// //         data: {
// //             car_id: car_id,
// //             user_id: user_id,
// //             start_date: start_date,
// //             end_date: end_date,
// //             duration: duration,
// //             total_price: total_price,
// //             total_dp: total_dp,
// //             status: 'Pending'
// //         }
// //     })

// //     return booking;
// // }

// const deleteBooking = async (booking_id) => {
//     const booking = await prisma.booking.findUnique({
//         where: {
//             booking_id: parseInt(booking_id)
//         }
//     })

//     if(!booking) {
//         throw new Error('Booking not found')
//     }

//     await prisma.booking.delete({
//         where: {
//             booking_id: booking_id
//         }
//     })
// }


// module.exports = {
//     newBooking,
//     getAllBooking,
//     deleteBooking
// }