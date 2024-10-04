const express = require('express');
const router = express.Router();
const userNoteController = require('../controllers/userNoteController');


router.get('/', async (req, res) => {
    try {
        const notes = await userNoteController.getAllNotes();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le note' });
    }
});

router.post('/', async (req, res) => {
    const { title, content, categories, createdAt, updatedAt, authorUsername, noteColor } = req.body;

    try {
        if (!title || !content || !authorUsername || !createdAt || !updatedAt || !noteColor) {
            throw new Error('Inserire tutti i Campi');
        }

        await userNoteController.addNote(title, content, categories, createdAt, updatedAt, authorUsername, noteColor);
        res.status(201).json({ message: 'Nota aggiunta con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const note = await userNoteController.findNoteByTitle(title);
        if (note) {
            res.status(200).json(note);
        } else {
            res.status(404).json({ error: 'Nota non trovata' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare la nota' });
    }
});

router.delete('/:authorUsername/:title', async (req, res) => {
    const { authorUsername, title } = req.params;
    try {
        await userNoteController.deleteNote(authorUsername, title);
        res.status(200).json({ message: 'Nota eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.put('/:authorUsername/:title', async (req, res) => {
    const { authorUsername, title } = req.params;
    const updatedData = req.body;

    try {
        await userNoteController.updateNote(authorUsername, title, updatedData);
        res.status(200).json({ message: 'Nota aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/authors/:authorUsername', async (req, res) => {
    const { authorUsername } = req.params;
    try {
        const notes = await userNoteController.getNotesByAuthor(authorUsername);
        if (notes.length > 0) {
            res.status(200).json(notes);
        } else {
            res.status(404).json({ error: 'Nessuna nota trovata per questo utente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le note per l\'utente' });
    }
});

module.exports = router;