// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createPdf } = require('./pdfconverter') // You need to create this module.

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  const { filename } = req.file;
  createPdf(filename); // Convert the image to PDF
  res.json({ message: 'File uploaded and converted successfully.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
