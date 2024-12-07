const prisma = require('../database/index.js')

const findCars = async () => {
    const cars = await prisma.cars.findMany({
        include: {
            booking: {
                select: {
                    user: {
                        select: {
                            email: true
                        }
                    },
                    start_date: true,
                    end_date: true
                }
            }
        }
    })

    return cars;
}

const findCarsById = async (car_id) => {
    const cars = await prisma.cars.findUnique({
        where:{
            car_id: parseInt(car_id)
        }
    })

    return cars;
}

const insertCars = async (newCars) => {
    console.log('Data to be inserted:', newCars);
    const cars = await prisma.cars.create({
        data:{
            title: newCars.title,
            model: newCars.model,
            fuel: newCars.fuel,
            capacity: newCars.capacity,
            transimisi: newCars.transimisi,
            year: newCars.year,
            color: newCars.color,
            price: newCars.price,
            no_plat: newCars.no_plat,
            imageUrl: newCars.imageUrl,
        },
    })
    console.log('Inserted data:', cars);
    return cars;
}

const deleteCarsById = async (car_id) => {
    const cars = await prisma.cars.delete({
        where: {
            car_id: car_id
        }
    })

    return cars;
}

const editCars = async (car_id, carData) => {
    const cars = await prisma.cars.update({
        where: {
            car_id: parseInt(car_id)
        },
        data: {
            title: carData.title,
            model: carData.model,
            fuel: carData.fuel,
            capacity: carData.capacity,
            transimisi: carData.transimisi,
            year: carData.year,
            color: carData.color,
            price: carData.price,
            no_plat: carData.no_plat,
            imageUrl: carData.imageUrl
        },
    })

    return cars;
}

module.exports = {
    findCars,
    findCarsById,
    insertCars,
    deleteCarsById,
    editCars
}