// const express = require("express");
// const prisma = require("../database/index.js");
// const { newBooking, getAllBooking, deleteBooking } = require("./booking.repo.js");
// const { deleteCarBooking } = require("./booking.services.js");

// const router = express.Router();

// router.get('/', async (req, res) => {
//   const booking = await getAllBooking()
//   res.send(booking);
// })

// router.post('/', async (req, res) => {

//   const { stat_date, end_date, duration, total_price, total_dp } = req.body;

//   if(!(stat_date && end_date && duration && total_price && total_dp)) {
//     return res.status(400).json({ message: "Mohon lengkapi semua data."})
//   }

//   const startDate = new Date(stat_date);
//   const endDate = new Date(end_date);




// })

// router.post('/', async (req, res) => {
//   try {
//     console.log(req.body);  
//     const { user_id, car_id, start_date, end_date, duration, total_price, total_dp } = req.body;
//     const startDate = new Date(start_date);
//     const endDate = new Date(end_date);

//     const booking = await newBooking(parseInt(car_id), parseInt(user_id),startDate, endDate, duration, parseFloat(total_price), parseFloat(total_dp));

//     res.status(200).json({
//       data: booking,
//       message: 'Booking created successfully',
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// router.delete('/:id', async (req, res) => {
//   try {
//     const booking_id = req.params.id
//     const parseId = parseInt(booking_id)
//     console.log('Booking ID', booking_id)

//     await deleteBooking(parseId)
//     res.status(200).send('Booking Deleted');
//   } catch (error) {
//     console.log(error.message)
//   }
// })



// module.exports = router;