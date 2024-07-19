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
    const { title, content, categories, createdAt, updatedAt, authorUsername } = req.body;

    try {
        // Assicurati che tutti i parametri necessari siano presenti
        if (!title || !content || !authorUsername || !createdAt || !updatedAt) {
            throw new Error('Inserire tutti i Campi');
        }

        // Aggiungi la nota usando il controller
        await userNoteController.addNote(title, content, categories, createdAt, updatedAt, authorUsername);
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

router.delete('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        await userNoteController.deleteNote(title);
        res.status(200).json({ message: 'Nota eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:title', async (req, res) => {
    const { title } = req.params;
    const updatedData = req.body;

    try {
        await userNoteController.updateNote(title, updatedData);
        res.status(200).json({ message: 'Nota aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/previews', async (req, res) => {
    const length = parseInt(req.query.length) || 200;
    try {
        const previews = await userNoteController.getNotesPreview(length);
        res.status(200).json(previews);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le preview delle note' });
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
