// import multer from "multer";
// import xlsx from "xlsx";
// import express from "express";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import fs from "fs";

// // const app = express();
// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Ensure the uploads directory exists during each invocation
// const uploadDir = path.join(__dirname, "../../uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // const uploadDir = path.join(__dirname, "../../uploads");
// // if (!fs.existsSync(uploadDir)) {
// //   fs.mkdirSync(uploadDir);
// // }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.post("/upload", upload.single("file"), (req, res) => {
//   try {
//     const filePath = path.join(uploadDir, req.file.filename);
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);

//     console.log(jsonData);
//     res.json(jsonData);
//   } catch (error) {
//     console.error("Error processing file:", error);
//     res.status(500).json({ error: "Error processing file" });
//   }
// });

// export default router;

import multer from "multer";
import xlsx from "xlsx";
import express from "express";

const router = express.Router();

const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File upload failed");
    }

    // Read the file buffer directly from memory
    const buffer = req.file.buffer;
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    console.log(jsonData);
    res.json(jsonData);
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Error processing file" });
  }
});

export default router;
