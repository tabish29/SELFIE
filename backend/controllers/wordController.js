const fs = require('fs');
const path = require('path');
const Word = require('../models/word'); // Importa il modello Word

function getRandomWord() {
    const filePath = path.join(__dirname, '../data', 'words.json');
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            try {
                const words = JSON.parse(data);
                if (words.length === 0) {
                    return reject(new Error("No words found in the file."));
                }
                const randomIndex = Math.floor(Math.random() * words.length);
                const randomWord = new Word(words[randomIndex]); // Crea un'istanza di Word
                resolve(randomWord.word);
            } catch (parseErr) {
                reject(parseErr);
            }
        });
    });
}

module.exports = {
    getRandomWord
};
