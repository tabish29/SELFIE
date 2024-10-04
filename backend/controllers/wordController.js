const fs = require('fs');
const path = require('path');
const Word = require('../models/word'); 

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
                    return reject(new Error("Non è stata trovata nessuna parola nel file."));
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
