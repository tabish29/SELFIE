const express = require('express');
const router = express.Router();
const flashcardController = require('../controllers/flashCardController');


router.get('/', async (req, res) => {
    try {
        const flashcards = await flashcardController.getAllFlashcards();
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le flashcard' });
    }
});

router.post('/', async (req, res) => {
    const { author, topic, flashcards } = req.body;

    try {
        if (!author || !topic || !flashcards || flashcards.length === 0) {
            throw new Error(`Inserire tutti i campi richiesti.`);
        }

        const lastFlashcard = flashcards[flashcards.length - 1];

        await flashcardController.addFlashcardSet(author, topic, lastFlashcard.question, lastFlashcard.answer);

        res.status(201).json({ message: 'Nuova flashcard aggiunta con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/authors/:author/topics', async (req, res) => {
    const { author } = req.params;
    const { topic } = req.body;

    try {
        if (!author || !topic) {
            throw new Error('Inserire tutti i campi richiesti');
        }

        await flashcardController.addFlashcardSet(author, topic, "", "");
        res.status(201).json({ message: 'Nuovo topic inserito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/authors/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const flashcards = await flashcardController.getFlashcardsByAuthor(author);
        if (flashcards.length > 0) {
            res.status(200).json(flashcards);
        } else {
            res.status(404).json({ error: 'Nessuna flashcard trovata per questo autore' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le flashcard per l\'autore' });
    }
});

router.put('/:author/:topic/:question', async (req, res) => {
    const { author, topic, question } = req.params;
    const { newQuestion, newAnswer } = req.body;

    try {
        await flashcardController.updateFlashcard(author, topic, question, newQuestion, newAnswer);
        res.status(200).json({ message: 'Flashcard aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:author/:topic/:question', async (req, res) => {
    const { author, topic, question } = req.params;

    try {
        await flashcardController.deleteFlashcard(author, topic, question);
        res.status(200).json({ message: 'Flashcard eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


module.exports = router;