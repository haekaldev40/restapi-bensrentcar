const express = require('express')
const { createdDestinations, getAllDestinations, getDestinationById } = require('./destinations.services')
const router = express.Router()

// Get All Destinations
router.get('/', async (req, res) => {
    const destination = await getAllDestinations()
    res.status(200).json({
        data: destination
    })
})

// Get Destination By Id
router.get('/:id', async (req, res) => {
    const destination_id = req.params.id
    const destination = await getDestinationById(parseInt(destination_id))
    res.status(200).json({
        data: destination
    })
})

// Create Destinations
router.post('/', async (req, res) => {
    try {
        const datas = req.body
        const destinations = await createdDestinations(datas)
        res.status(200).json({
            data: destinations
        })
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})



module.exports = router;