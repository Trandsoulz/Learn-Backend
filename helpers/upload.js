// import multer from "multer";
// import { fileURLToPath } from "url";
// import path from "path";

// const allowedStorage = 10 * 1024 * 1024; // 10MB

// Get the current file path
// const __filename = fileURLToPath(import.meta.url);
// Get the current directory name
// const __dirname = path.dirname(__filename);
// console.log(__dirname);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadPath = path.resolve(__dirname, "../my-uploads");
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const fileExtension = path.extname(file.originalname);

//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: allowedStorage },
//   dest: "uploads/", // Alternative to destination
// });

import multer from "multer";

const storage = multer.memoryStorage(); // store image in memory
const upload = multer({ storage: storage });

export default upload;



// Get the images from client
// Store it inside 