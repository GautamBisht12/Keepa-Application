import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
// const upload = configureFileUpload(path.join(__dirname, 'uploads'));

const PORT = 3000;

app.use(express.json());

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve static files

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "public")));

// Serve static files from the 'node_modules' directory
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));

// Serve Tabulator CSS file with the correct MIME type
app.use(
  express.static("public", {
    setHeaders: (res, path, stat) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

// Endpoint for file upload
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const workbook = xlsx.readFile(filePath);
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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
