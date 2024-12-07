const express = require('express')
const cors = require('cors')
const dotenv = require("dotenv").config();
const path = require('path')
const app = express()



const carsController = require('./cars/car.controller')
const destinationController = require('./destinations/destinations.controller')
const usersController = require('./users/user.controller')
// const bookingsController = require('./bookings/booking.controller')
const bookingController = require('./bookingsv2/bookingsv2.controller')
// const paymentController = require('./payments/payments.controller')
const paymentController = require('./paymentsv2/paymentsv2.controller')

const registerController = require('./auth/auth.controller')
const loginController = require('./auth/auth.controller');
const upload = require('./middleware/uploadImage');


const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


// Middleware Controller

app.use('/bookingsv2', bookingController)
app.use('/paymentsv2', paymentController)
app.use('/api/cars', carsController)
app.use('/api/destinations', destinationController) 
app.use('/api/users', usersController)
// app.use('/bookings', bookingsController)
// app.use('/payments', upload.single('img_transcation'), paymentController)
// app.use('/auth', upload.single('imgUser'),registerController)
// app.use('/auth', loginController)
// app.use(express.static('public/uploads'))

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})