const prisma = require('../database/index.js')

const findUser = async () => {
    const user = await prisma.user.findMany()
    return user;
}

const findUserById = async (user_id) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: user_id
        }
    })
    return user;
}

const insertUser = async (datas, hashPassword) => {
    const user = await prisma.user.create({
        data: {
            name: datas.name,
            email: datas.email,
            password: hashPassword,
        }
    })
    return user;
}

const getUserEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    return user;
}

const updateUser = async (user_id, datas) => {
    const user = await prisma.user.update({
        where: {
            user_id: user_id
        },
        data: {
            email: datas.email,
            password: datas.password,
            address: datas.address,
            phone: datas.phone,
            firstName: datas.firstName,
            lastName: datas.lastName,
            imgUser: datas.imgUser
        }
    })
    return user;
}

const deleteUser = async (user_id) => {
    const user = await prisma.user.delete({
        where: {
            user_id: user_id
        }
    })
    return user;
}

module.exports = {
    findUser,
    findUserById,
    insertUser,
    updateUser,
    deleteUser,
    getUserEmail
}