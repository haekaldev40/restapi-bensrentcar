const prisma = require('../database/index.js')
const { findUser, findUserById, insertUser, updateUser, deleteUser } = require('./user.repo.js')

const getAllUsers = async () => {
    const user = await findUser()
    return user;
}

const getTotalUser = async () => {
    const user = await prisma.user.count()

    return user;
}

const getUserById = async (user_id) => {
    const user = await findUserById(user_id)

    if(!user) {
        throw Error("Data User Tidak Ditemukan!")
    }

    return user;
}

const createUser = async (datas, hashPassword) => {
    const user = await insertUser(datas, hashPassword)

    return user
}

const updateUserById = async (user_id, datas) => {
    await getUserById(user_id)

    const user = await updateUser(user_id, datas)

    return user;
}

const deleteUserById = async (user_id) => {
    await getUserById(user_id)

    const user = await deleteUser(user_id)

    return user;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById,
    getTotalUser
}