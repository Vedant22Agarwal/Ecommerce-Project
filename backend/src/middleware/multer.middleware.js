// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });

import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({ storage });