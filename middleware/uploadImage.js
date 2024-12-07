const multer = require('multer')
const path = require('path')
const fs = require('fs');

const uploadDirectory = 'public/uploads';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage: storage,
    maxSize: 5 * 1000 * 1000 // 5 MB 
}).fields([
    { name: 'img_transcation', maxCount: 1 },
    { name: 'img_ktp', maxCount: 1 },
    { name: 'img_sim', maxCount: 1 }
])

module.exports = upload;