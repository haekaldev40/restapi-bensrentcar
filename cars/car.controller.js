// Cars Controller
// Menghandle request, response serta validasi dari body.

const express = require('express')
const prisma = require('../database/index.js');
const { getAllCars, getCarsById, createCars, deleteCars, editCarsById, countTotalCars } = require('./car.services.js');
const router = express.Router()

router.get("/", async (req, res) => {
    // Mendapatkan semua data menggunakan findMany()
    const cars = await getAllCars();
    // Memberikan respon untuk mengirimakan data dari variabel yang sudah dibuat.
    res.send(cars);
  });

  router.get('/totalcars', async (req, res) => {
    try {
      const totalCars = await countTotalCars();
      res.json({ totalCars });
    } catch (error) {
      console.error('Error counting total cars:', error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  
router.get("/:id", async (req, res) => {

    try {
      const carId = parseInt(req.params.id);
      
        const cars = await getCarsById(carId)
          
          res.send(cars)
    } catch (error) {
        res.send(error.message)
    }
  
  })
  
router.post("/", async (req,res) => {

    try {
        const newCars = req.body

        if (!(newCars.title && newCars.model && newCars.fuel && newCars.capacity && newCars.transimisi && newCars.year && newCars.color && newCars.price && newCars.no_plat && newCars.imageUrl)) {
            return res.status(400).send("Mohon lengkapi semua data.")
        }

        console.log('Data received:', newCars); // Log the data received

        const cars = await createCars(newCars)

        console.log('Data added to database:', cars);
    
        res.json({
            data: cars,
            message: "Data Berhasil Ditambahkan!"
        })
        
    } catch (error) {
        res.json(error.message)
    }
  })
  
router.delete('/:id', async (req, res) => {

    try {
        const carId = req.params.id
        const parseId = parseInt(carId)
        const cars = await getCarsById(parseId)

        if(!cars) {
            res.status(404).send("Data Tidak Ditemukan!")
        }

        console.log(`Attempting to delete car with ID: ${parseId}`);
    
        await deleteCars(parseId)
    
        res.send('Data Berhasil Dihapus!')
        
    } catch (error) {
        console.log(error.message)
    }
  })
  
router.put('/:id', async (req, res) => {
      const carId = req.params.id
      const carData = req.body
  
      if (!(carData.title && carData.model && carData.fuel && carData.capacity && carData.transimisi && carData.year && carData.color && carData.price && carData.no_plat && carData.imageUrl)) {
        return res.status(400).send("Mohon lengkapi semua data.")
    }
  
      const cars = await editCarsById(parseInt(carId), carData)
  
      res.send({
          data: cars,
          message: "Data Berhasil Diupdate!",
      })
  })
  
router.patch('/:id', async (req, res) => {
      const carId = req.params.id
      const carData = req.body
  
      const cars = await editCarsById(parseInt(carId), carData)
  
      res.send({
          data: cars,
          message: "Data Berhasil Diupdate!",
      })
  })

module.exports = router;