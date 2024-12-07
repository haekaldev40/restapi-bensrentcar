const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const express = require("express");
const {
  createBooking,
  checkAvailability,
  getBookingHistory,
  getAllBookingHistory,
  calculateTotalRevenue,
  getRecentBookings,
} = require("./bookingsv2.services");

const router = express.Router();

router.post("/checkavailability", async (req, res) => {
  try {
    const { car_id, start_date, end_date } = req.body;
    console.log("Received data:", { car_id, start_date, end_date });

    if (!start_date || !end_date) {
      console.error(
        "Error checking availability: Missing start_date or end_date"
      );
      return res.status(400).json({ message: "Data tidak lengkap." });
    }

    const isAvailable = await checkAvailability(car_id, start_date, end_date);
    console.log("Availability:", isAvailable); // Logging

    if (!isAvailable) {
      return res
        .status(200)
        .json({ message: "Tanggal tidak tersedia atau sudah penuh." });
    }

    // res.json({ message: "Tanggal tersedia." });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const newBooking = req.body;

    console.log("Received booking data:", newBooking);

    if (
      !(
        newBooking.car_id &&
        newBooking.user_id &&
        newBooking.start_date &&
        newBooking.end_date &&
        newBooking.duration &&
        newBooking.total_price
      )
    ) {
      return res.status(400).json({ message: "Mohon lengkapi semua data." });
    }

    const booking = await createBooking(newBooking);
    res.send({
      message: "Booking Berhasil.",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const history = await getAllBookingHistory();
    console.log(`Fetching booking history for user ID: ${history}`);
    res.json(history);
  } catch (error) {
    console.error("Error fetching all booking history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/revenue", async (req, res) => {
  try {
    const totalRevenue = await calculateTotalRevenue();
    res.json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const recentBookings = await getRecentBookings();
    res.json({ recentBookings });
  } catch (error) {
    console.error("Error fetching recent bookings:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const updatedBooking = req.body;


    const updated = await prisma.booking.update({
      where: { booking_id: bookingId },
      data: {
        return_date: new Date(updatedBooking.return_date).toISOString(),
        charge: updatedBooking.charge,
      },
    });

    res.json({
      message: "Booking updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// router.get("/:id", async (req, res) => {
//   try {
//     const bookingId = req.params.id;

//     const booking = await getBookingDetail(parseInt(bookingId));
//     if (!booking) {
//       return res.status(404).send("Booking tidak ditemukan.");
//     }

//     res.send({
//       message: "Detail Booking Berhasil Diambil.",
//       data: booking,
//     });
//   } catch (error) {
//     res.status(400).send(error.message);
//   }
// });
router.get("/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log(`Fetching booking history for user ID: ${userId}`);
    const history = await getBookingHistory(userId);
    res.json(history);
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
