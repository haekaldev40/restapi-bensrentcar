const prisma = require('../database/index.js')

const createUser = async (datas, hashPassword) => {
    const user = await prisma.user.create({
        data: {
            email: datas.email,
            password: hashPassword,
            phone: datas.phone,
            firstName: datas.firstName,
            lastName: datas.lastName,
            address: datas.address,
            imgUser: datas.imgUser 
        }
    })

    return user;
}
const getEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    return user;
}


module.exports = {
    getEmail,
    createUser,
}