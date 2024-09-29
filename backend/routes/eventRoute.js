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
    const { title, dateStart, dateEnd, notes = '', place = '', recurrence, recurrenceEnd, authorUsername } = req.body;
    try {
        if (!title || !dateStart || !dateEnd || !recurrence || !authorUsername) {
            throw new Error('Inserire tutti i campi obbligatori');
        }

        await eventController.addEvent(title, dateStart, dateEnd, place, notes, recurrence, recurrenceEnd, authorUsername);
        res.status(201).json({ message: 'Evento aggiunta con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta dell\'evento:', error.message);

        res.status(400).json({ error: error.message });
    }
});

router.put('/:title', async (req, res) => {
    const { title } = req.params; // Titolo dell'evento da aggiornare
    const updatedData = req.body; // Dati aggiornati dell'evento passati nel body

    try {
        // Verifica la presenza dei campi obbligatori (opzionale)
        if (!updatedData.title || !updatedData.dateStart || !updatedData.dateEnd || !updatedData.recurrence || !updatedData.authorUsername) {
            throw new Error('Inserire tutti i campi obbligatori');
        }

        // Chiamata al controller per aggiornare l'evento con il titolo specificato
        const updatedEvent = await eventController.updateEvent(title, updatedData);

        // Risposta di successo
        res.status(200).json({ message: 'Evento aggiornato con successo', event: updatedEvent });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'evento:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/authors/:authorUsername', async (req, res) => {
    console.log("get eventRoute");
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

router.delete('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        await eventController.deleteEvent(title);
        res.status(200).json({ message: 'Evento eliminato con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;