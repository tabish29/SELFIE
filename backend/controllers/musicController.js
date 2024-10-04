const fs = require('fs-extra');
const path = require('path');

// Path della cartella in cui salveremo i file
const musicFolderPath = path.join(__dirname, '../data/musics');

// Funzione per aggiungere il file mp3
const uploadMusic = (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'Nessun file inviato.' });
  }

  const filePath = path.join(musicFolderPath, req.file.filename);

  // Salva il file nella cartella "music"
  res.status(200).send({ message: 'File caricato con successo.', file: req.file.filename });
};

// Funzione per rimuovere il file
const removeMusic = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(musicFolderPath, fileName);

  try {
    // Controlla se il file esiste
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      return res.status(200).send({ message: 'File rimosso con successo.' });
    } else {
      return res.status(404).send({ message: 'File non trovato.' });
    }
  } catch (error) {
    return res.status(500).send({ message: 'Errore durante la rimozione del file.', error });
  }
};

module.exports = {
  uploadMusic,
  removeMusic,
};
