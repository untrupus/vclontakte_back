const path = require("path");
const {nanoid} = require('nanoid');
const multer = require('multer');

const rootPath = __dirname;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,  path.join(rootPath, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, nanoid() + path.extname(file.originalname));
  }
});
const upload = multer({storage});

module.exports = {
  upload,
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  db: {
    name: "vclontakte",
    url: "mongodb://localhost"
  },
};