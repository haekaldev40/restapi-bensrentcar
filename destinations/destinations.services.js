const { createDestinations, findAllDestinations, findDestinationById } = require("./destinations.repo")

const getAllDestinations = async () => {
    const destination = await findAllDestinations()
    return destination;
}

const getDestinationById = async (destinations_id) => {
    const destination = await findDestinationById(destinations_id)
    return destination;
}
const createdDestinations = async (data) => {
    const destination = await createDestinations(data)
    return destination;
}

module.exports = {
    getAllDestinations,
    getDestinationById,
    createdDestinations
}