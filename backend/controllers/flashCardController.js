const fs = require('fs');
const path = require('path');
const FlashcardSet = require('../models/flashcardSet');

const FLASHCARD_FILE = path.join(__dirname, '../data', 'flashcards.json');

async function readFlashcardFile() {
    try {
        const data = await fs.promises.readFile(FLASHCARD_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];  
        } else {
            throw error;
        }
    }
}

async function writeFlashcardFile(flashcards) {
    await fs.promises.writeFile(FLASHCARD_FILE, JSON.stringify(flashcards, null, 2));
}

async function addFlashcardSet(author, topic, question, answer) {
    const flashcards = await readFlashcardFile();

    
    let flashcardSet = flashcards.find(fc => fc.author === author && fc.topic === topic);

    if (!flashcardSet) {
        flashcardSet = new FlashcardSet(author, topic, []);
        flashcards.push(flashcardSet);
    }

 
    const existingFlashcard = flashcardSet.flashcards.find(fc => fc.question === question);
    if (existingFlashcard) {
        throw new Error('Esiste già una flashcard con questa domanda');
    }

  
    flashcardSet.flashcards.push({ question, answer });


    await writeFlashcardFile(flashcards);
}

async function deleteFlashcard(author, topic, question) {
    const flashcards = await readFlashcardFile();
  
    const flashcardSet = flashcards.find(fc => fc.author === author && fc.topic === topic);
    if (!flashcardSet) {
        throw new Error('Set di flashcard non trovato');
    }

    flashcardSet.flashcards = flashcardSet.flashcards.filter(fc => fc.question !== question);

    if (flashcardSet.flashcards.length === 0) {
        const setIndex = flashcards.indexOf(flashcardSet);
        flashcards.splice(setIndex, 1);
    }

    await writeFlashcardFile(flashcards);
}


async function updateFlashcard(author, topic, question, newQuestion, newAnswer) {
    const flashcards = await readFlashcardFile();

    const flashcardSet = flashcards.find(fc => fc.author === author && fc.topic === topic);
    if (!flashcardSet) {
        throw new Error('Set di flashcard non trovato');
    }

    const flashcard = flashcardSet.flashcards.find(fc => fc.question === question);
    if (!flashcard) {
        throw new Error('Flashcard non trovata');
    }

    flashcard.question = newQuestion || flashcard.question;
    flashcard.answer = newAnswer || flashcard.answer;

    await writeFlashcardFile(flashcards);
}

async function getAllFlashcards() {
    return await readFlashcardFile();
}

async function getFlashcardsByAuthor(author) {
    const flashcards = await readFlashcardFile();
    return flashcards.filter(fc => fc.author === author);
}

module.exports = {
    addFlashcardSet,
    deleteFlashcard,
    updateFlashcard,
    getAllFlashcards,
    getFlashcardsByAuthor
};