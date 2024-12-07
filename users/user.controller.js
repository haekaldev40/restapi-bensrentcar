const express = require('express')
const prisma = require('../database/index.js');
const path = require('path')
const bcrypt = require('bcrypt')
const JWT = require ('jsonwebtoken')
const { getAllUsers, getUserById, createUser, getTotalUser} = require('./user.services.js');
const { getUserEmail } = require('./user.repo.js');
const router = express.Router()


router.post('/register', async (req, res) => {
    try {
        const datas = req.body
        console.log('Datas', datas)

        if (!(datas.name && datas.email  && datas.password)) {
            return res.status(400).json({ message: "Mohon lengkapi semua data."})
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: datas.email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan."});
        }
        const hashPassword = await bcrypt.hash(datas.password, 10)
        const user = await createUser(datas, hashPassword)
        const token = JWT.sign({email: datas.email}, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' })
        res.status(200).json({
            data: user,
            token: token,
            message: "Register Berhasil!"
        })
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body

    if (!(email && password)) {
        return res.status(400).json({message: "Mohon lengkapi semua data."})
    }

    const user = await getUserEmail(email)

    if(!user) {
        return res.status(400).json({message: "Email tidak terdaftar!"})
    }

    const isPasswordCorrect = await bcrypt.compareSync(password, user.password)

    if(!isPasswordCorrect) {
        return res.status(400).json({message: "Password salah!"})
    }
    const token = JWT.sign({email: user.email}, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' })

    res.status(200).json({
        data: user,
        token: token,
        role: user.role,
        message: "Login Berhasil."
    })
})

router.get('/', async (req, res) => {
    const user = await getAllUsers()
    res.send(user)
})

router.get('/totaluser', async (req,res) => {
    try {
        const totalUser = await getTotalUser()
        res.json({totalUser})
        
    } catch (error) {
        console.error('Error counting total cars:', error);
      res.status(500).json({ message: "Internal server error." });
    }

})

router.get('/:id', async (req, res) => {

    try {
        const userId = req.params.id
        const parseId = parseInt(userId)
    
        const user = await getUserById(parseId)
        res.status(200).send(user)
        
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// router.patch('/:id', async (req, res) => {
//     try {
//         const userId = req.params.id
//         const parseId = parseInt(userId)
//         const datas = req.body
//         const imagePath = req.file?.filename

//         if (!(datas.email && datas.password && datas.address && datas.phone && datas.firstName && datas.lastName && imagePath)) {
//             return res.status(400).send("Mohon lengkapi semua data.")
//         }
//         datas.imgUser = imagePath
//         const user = await updateUserById(parseId, datas)

//         res.status(200).send(user);


//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

// router.delete('/:id', async (req, res) => {
//     try {

//         const userId = req.params.id
//         const parseId = parseInt(userId)
        
//         const user = await deleteUserById(parseId)

//         res.status(200).json({
//             message: "Data Berhasil Dihapus!"
//         })
        
//     } catch (error) {
//         res.status(400).send(error.message)
//     }
// })

module.exports = router;