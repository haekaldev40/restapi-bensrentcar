const express = require('express')
const { createPayment, completePayment, findPayment, deletePayment, findPaymentById } = require('./payments.repo')
const router = express.Router()

router.get('/', async (req, res) => {
    const payment = await findPayment()
    res.send(payment)
})

router.get('/:id', async (req,res) => {
    const payment_id = req.params.id
    const parseId = parseInt(payment_id)
    const payment = await findPaymentById(parseId)

    res.send(payment)
})

router.post('/', async (req, res) => {
    try {
        const { booking_id, amount} = req.body
        const img_transcation = req.file.path;
        const payment = await createPayment(parseInt(booking_id), img_transcation, parseFloat(amount))

        res.status(200).send(payment)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const paymentId = req.params.id
        const parseId = parseInt(paymentId)
        await deletePayment(parseId)
        res.status(200).send('Payment Deleted');
    } catch (error) {
        res.status(400).send(error.message)
    }

})

// router.post('/complete-payment', async (req, res) => {
//     try {
//         const { booking_id } = req.body
//         await completePayment(booking_id)

//         res.status(200).send('Payment Completed');
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })



module.exports = router;