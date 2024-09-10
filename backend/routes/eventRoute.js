const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');


router.get('/', async (req, res) => {
    try {
        const events = await eventController.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare gli eventi' });
    }
});

router.post('/', async (req, res) => {
    const { title, dateStart, dateEnd, notes = '', authorUsername } = req.body;
    
    try {
        if (!title || !dateStart || !dateEnd || !authorUsername) {
            throw new Error('Inserire tutti i campi obbligatori');
        }

        await eventController.addEvent(title, dateStart, dateEnd, notes, authorUsername);
        res.status(201).json({ message: 'Evento aggiunta con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta dell\'evento:', error.message);

        res.status(400).json({ error: error.message });
    }
});

router.get('/authors/:authorUsername', async (req, res) => {
    const { authorUsername } = req.params;
    try {
        const events = await eventController.getEventsByAuthor(authorUsername);
        if (events.length > 0) {
            res.status(200).json(events);
        } else {
            res.status(404).json({ error: 'Nessuna evento trovato per questo utente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare gli eventi per l\'utente' });
    }
});

module.exports = router;