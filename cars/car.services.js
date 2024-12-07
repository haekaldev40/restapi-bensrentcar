const prisma = require('../database/index.js')
const { findCars, findCarsById, insertCars, deleteCarsById, editCars } = require('./car.repo.js')

const getAllCars = async () => {

    const cars = await findCars();

    return cars;
}

const countTotalCars = async () => {
    const totalCars = await prisma.cars.count();
    return totalCars;
  };

const getCarsById = async (car_id) => {
    const cars = await findCarsById(parseInt(car_id))

    if(!cars) {
        throw Error("Data Mobil Tidak Ditemukan!")
    }

    return cars;

}

const createCars = async (newCars) => {
    const cars = await insertCars(newCars)

    return cars;
}

const deleteCars = async (car_id) => {
    // Jika ingin mendelete suatu, harus makesure barangnya dengan id tersebut harus ada.
    await getCarsById(car_id)

    const cars = await deleteCarsById(car_id)
    return cars;
}

const editCarsById = async (car_id, carData) => {
    await getCarsById(car_id)

    const cars = await editCars(car_id, carData)
    
    return cars;
}

module.exports = {
    getAllCars,
    getCarsById,
    createCars,
    deleteCars,
    editCarsById,
    countTotalCars
}