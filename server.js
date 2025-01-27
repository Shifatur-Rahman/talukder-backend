const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

// Database connection
const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CvDb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 
    console.log("Database connected"); 
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
};
   
connectDb();  
  
// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to allow only jpg, pdf, and word files
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|pdf|docx|doc/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());  // Check file extension
  const mimetype = allowedTypes.test(file.mimetype);  // Check MIME type

  if (extname && mimetype) {
    return cb(null, true); // File is accepted
  } else {
    return cb(new Error("Only jpg, pdf, and word files are allowed."), false); // Reject file
  }
};

const upload = multer({ storage, fileFilter });

// Schema and model

const CvSchema = new mongoose.Schema({
  name: { type: String, index: true },
  email: { type: String, index: true },
  phone: { type: Number, index: true },
  remarks: {type: String, index: true},
  cv: String,
  uploadedAt: { type: Date, default: Date.now },
}); 

const Cv = mongoose.model("Cv", CvSchema);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the CV Upload Backend");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { name, email, phone, remarks } = req.body;
  const filePath = req.file.path;

  try {
    const newCv = new Cv({ name, email, phone, remarks, cv: filePath });
    await newCv.save();
    res.status(201).json({ message: "CV uploaded successfully", cv: newCv });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload CV" });
  }
});

// // Get All CVs
app.get("/cvs", async (req, res) => {
  try {
    const cvs = await Cv.find();
    res.status(200).json(cvs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch CVs" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

