const { v1: uuidv1 } = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/poster_images/')
    },
    filename: function (req, file, cb) {
        const fileName = uuidv1() + file.originalname.slice(file.originalname.lastIndexOf('.'));
        return cb(null, fileName);
    }
})

const upload = multer({ storage: storage })

module.exports = upload;