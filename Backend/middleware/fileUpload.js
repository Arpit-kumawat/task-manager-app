const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // console.log("originalname:", file.originalname);
  // console.log("mimetype:", file.mimetype);

  const allowedTypes = /jpg|jpeg|png|webp/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType =
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp";

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const fileUpload = multer({
  storage,
  fileFilter,
});

module.exports = fileUpload;