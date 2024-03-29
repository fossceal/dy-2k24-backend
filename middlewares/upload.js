const { v1: uuidv1 } = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        const fileName = uuidv1() + file.originalname.slice(file.originalname.lastIndexOf('.'));
        cb(null, fileName);
    },
});

module.exports = { storage };