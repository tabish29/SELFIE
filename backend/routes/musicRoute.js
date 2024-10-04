const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const musicController = require('../controllers/musicController');
const musicDirectory = path.join(__dirname, '../data/musics');

// Configurazione Multer 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const musicFolderPath = path.join(__dirname, '../data/musics');
    cb(null, musicFolderPath);
  },
  filename: function (req, file, cb) {
    const fileName = `${file.originalname}`;
    cb(null, fileName);
  }
});

// Middleware di Multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
  
    if (file.mimetype === 'audio/mpeg') {
      cb(null, true);
    } else {
      cb(new Error('Solo file MP3 sono permessi'), false);
    }
  }
});

router.post('/', upload.single('file'), musicController.uploadMusic);


router.delete('/:fileName', musicController.removeMusic);

router.get('/', (req, res) => {
  if (!fs.existsSync(musicDirectory)) {
    return res.status(400).json({ error: 'La directory music non esiste' });
  }

  fs.readdir(musicDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Impossibile analizzare la directory music' });
    }

    const mp3Files = files.filter(file => file.endsWith('.mp3'));
    res.json(mp3Files);
  });
});

module.exports = router;
