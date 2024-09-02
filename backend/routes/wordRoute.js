const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');

// Route per ottenere una parola casuale
router.get('/random', async (req, res) => {
    try {
        const word = await wordController.getRandomWord(); // Usa il metodo randomWord del controller
        res.status(200).json(word); // Restituisci la parola come JSON
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare una parola casuale' });
    }
});

// Route per ottenere tutte le parole (se necessario)
/*router.get('/', async (req, res) => {
    try {
        const words = await wordController.getAllWords(); // Supponiamo che tu abbia un metodo per ottenere tutte le parole
        res.status(200).json(words);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le parole' });
    }
});

// Route per aggiungere una nuova parola (se necessario)
router.post('/', async (req, res) => {
    const { word } = req.body;

    try {
        await wordController.addWord(word); // Supponiamo che tu abbia un metodo per aggiungere una parola
        res.status(201).json({ message: 'Parola aggiunta con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route per ottenere una parola specifica per ID (se necessario)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const word = await wordController.getWordById(id); // Supponiamo che tu abbia un metodo per ottenere una parola per ID
        if (word) {
            res.status(200).json(word);
        } else {
            res.status(404).json({ error: 'Parola non trovata' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare la parola' });
    }
});

// Route per eliminare una parola per ID (se necessario)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await wordController.deleteWord(id); // Supponiamo che tu abbia un metodo per eliminare una parola per ID
        res.status(200).json({ message: 'Parola eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route per aggiornare una parola per ID (se necessario)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    try {
        await wordController.updateWord(id, updatedData); // Supponiamo che tu abbia un metodo per aggiornare una parola per ID
        res.status(200).json({ message: 'Parola aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});*/

module.exports = router;
