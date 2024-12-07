const prisma = require('../database/index.js')

const findAllDestinations = async () => {
    const destination = await prisma.destinations.findMany()
    return destination;
}

const findDestinationById = async (destinations_id) => {
    const destination = await prisma.destinations.findUnique({
        where: {
            destinations_id: destinations_id
        }
    })

    return destination
}

const createDestinations = async (data) => {
    const destinations = await prisma.destinations.create({
        data: {
            name: data.name,
            price: data.price
        }
    })

    return destinations;
}

module.exports = {
    findAllDestinations,
    findDestinationById,
    createDestinations
}