const express = require("express");
const { createPayment, getAllPaymentHistory, updateStatusPayment, getDataByMonth } = require("./paymentsv2.services");
const upload = require('../middleware/uploadImage')

const router = express.Router();

router.post('/', upload, async (req, res) => {

    try {
        const paymenData = req.body;
        console.log("payment created: ", paymenData)
        if(!(paymenData.booking_id && req.files)) {
            return res.status(400).json({ message: "Mohon lengkapi semua data."})
        }
        paymenData.img_transcation = req.files['img_transcation'][0].filename;
        paymenData.img_ktp = req.files['img_ktp'][0].filename;
        paymenData.img_sim = req.files['img_sim'][0].filename;

        paymenData.booking_id = parseInt(paymenData.booking_id);

        const payment = await createPayment(paymenData)
        res.send({
            message: "Pembayaran Berhasil.",
            data: payment,
            success: true
        });
    } catch (error) {
        console.error("Error creating payment:", error);
        res.status(400).send({ message: error.message, success: false });
    }
})

router.get('/allpayment', async (req, res) => {
    try {
        const allpayment = await getAllPaymentHistory()
    
        res.send(allpayment)
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.get('/data-byDate', async (req, res) => {
    try {
        const { month } = req.query;
        const allpayment = await getDataByMonth(month);
    
        res.send(allpayment);
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.patch('/updatestatus/:paymentId', async (req, res) => {
    try {
        const paymentId = parseInt(req.params.paymentId);
        const { status } = req.body;
        const updatedPayment = await updateStatusPayment(paymentId, status);
        res.send({
            message: "Status Booking Berhasil Diupdate.",
            data: updatedPayment
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});


module.exports = router