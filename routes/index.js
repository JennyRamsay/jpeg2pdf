const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
  }
});

const fileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.png' && ext !== '.jpg') {
    return callback(new Error('Only png and jpg files are accepted'));
  } else {
    return callback(null, true);
  }
};

const upload = multer({ storage, fileFilter });

router.get('/', (req, res, next) => {
  if (req.session.imagefiles === undefined) {
    res.sendFile(path.join(__dirname, '..', '/public/html/index.html'));
  } else {
    res.render('index', { images: req.session.imagefiles });
  }
});

router.post('/upload', upload.array('images'), (req, res) => {
  if (req.files.length === 0) {
    res.redirect('/');
  } else {
    const files = req.files;
    const imgNames = files.map((file) => file.filename);

    req.session.imagefiles = imgNames;

    res.redirect('/');
  }
});

router.post('/pdf', (req, res, next) => {
  const body = req.body;
  console.log(body);
  const doc = new PDFDocument({ size: 'A4', autoFirstPage: false });
  const pdfName = `pdf-${Date.now()}.pdf`;

  doc.pipe(fs.createWriteStream(path.join(__dirname, '..', `/public/pdf/${pdfName}`)));

  for (const name of body) {
    doc.addPage();
    doc.image(path.join(__dirname, '..', `/public/images/${name}`), 20, 20, {
      width: 555.28,
      align: 'center',
      valign: 'center',
    });
  }

  doc.end();

  res.send(`/pdf/${pdfName}`);
});

router.get('/new', (req, res, next) => {
  const filenames = req.session.imagefiles;
  const deleteFiles = async (paths) => {
    const deleting = paths.map((file) =>
      fs.unlink(path.join(__dirname, '..', `/public/images/${file}`))
    );
    await Promise.all(deleting);
  };

  deleteFiles(filenames);
  req.session.imagefiles = undefined;
  res.redirect('/');
});

module.exports = router;