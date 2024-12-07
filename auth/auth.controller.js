const express = require('express')
const bcrypt = require('bcrypt')
const prisma = require('../database/index.js')
const { getEmail, createUser } = require('./auth.repo.js')
const JWT = require('jsonwebtoken')
const router = express.Router()


// Register User
router.post('/register', async (req, res) => {
    try {
        const datas = req.body
        const imagePath = req.file?.path; // Get the uploaded file path

        console.log('Datas', req.body);
        console.log('Datas', req.body)

        if (!(datas.email && datas.password && datas.address && datas.phone && datas.firstName && datas.lastName && imagePath)) {
            return res.status(400).json({ message: "Mohon lengkapi semua data."})
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: datas.email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email sudah digunakan." });
        }
        datas.imgUser = imagePath
        const hashPassword = await bcrypt.hash(datas.password, 10)
        const user = await createUser(datas, hashPassword)
        const token = JWT.sign({email: datas.email}, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' })
        res.status(200).json({
            data: user,
            token: token
            
        })
    } catch (error) {
        console.log("error:", error)
        res.status(400).json({ message: error.message });
    }
})

// Login User
router.post('/login', async (req, res) => {

    // Mengisikan email dan password dari request body.
    const {email, password} = req.body
    // Jika dari salah satu email dan password tidak disikan.
    if(!(email && password)) {
        return res.status(400).send("Mohon lengkapi semua data.")       
    }

    // Mencari data user berdasarkan email yang diinputkan.
    const user = await getEmail(email)

    // Jika email yang diinputkan tidak ada atau tidak sesuai dengan data yang diinputkan
    if(!user) {
        return res.status(400).send("Email tidak terdaftar!")
    }

    // Membandingkan password yang diinputkan dengan password yang ada di database.
    const isPasswordCorrect = await bcrypt.compareSync(password, user.password)

    // Jika password yang diinputkan tidak sesuai
    if(!isPasswordCorrect) {
        return res.status(400).send("Password salah!")
    }

    const token = await JWT.sign({email: user.email}, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' })

    // Mengembalikan data user.
    return res.status(200).json({
        data: user,
        token: token,
        message: "Login Berhasil"
    })
})

module.exports = router;