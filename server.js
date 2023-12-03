const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();
const port = 3000;

// Serve the HTML pages from the public directory
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));



// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });



// Handle file upload
app.post('/uploadImage', upload.single('imageData'), (req, res) => {
  const uploadedDate = req.body.dateData;
  const imagePath = req.file.path;

  // Read existing data from JSON file
  let data = [];
  try {
    const jsonData = fs.readFileSync('data.json', 'utf-8');
    data = JSON.parse(jsonData);
  } catch (err) {
    console.error('Error reading data from JSON file:', err);
  }

  // Add new entry
  data.push({ date: uploadedDate, imagePath: imagePath });

  // Save updated data to JSON file
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  res.send('File uploaded successfully!');
});








app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
