const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');


router.get('/', async (req, res) => {
    try {
        const activities = await activityController.getAllActivities();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le attivita' });
    }
});

router.post('/', async (req, res) => {
    const { title, dueDate, notes = '', authorUsername } = req.body;

    try {
        if (!title || !dueDate || !authorUsername) {
            throw new Error('Inserire tutti i Campi obbligatori');
        }

        await activityController.addActivity(title, dueDate, notes, authorUsername);
        res.status(201).json({ message: 'Attivita aggiunta con successo' });
    } catch (error) {
        console.error('Errore durante l\'aggiunta dell\'attività:', error.message);

        res.status(400).json({ error: error.message });
    }
});

router.put('/:authorUsername/:title', async (req, res) => {

    const { authorUsername, title } = req.params; 
    const updatedData = req.body; 

    try {
        await activityController.updateActivity(authorUsername, title, updatedData);
        res.status(200).json({ message: 'Evento aggiornato con successo'});
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'evento:', error.message);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/:authorUsername/:title', async (req, res) => {
    const { authorUsername, title } = req.params;
    try {
        await activityController.deleteActivity(authorUsername, title);
        res.status(200).json({ message: 'Attivita eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.get('/authors/:authorUsername', async (req, res) => {
    const { authorUsername } = req.params;
    try {
        const activities = await activityController.getActivitiesByAuthor(authorUsername);
        if (activities.length > 0) {
            res.status(200).json(activities);
        } else {
            res.status(404).json({ error: 'Nessuna attivita trovata per questo utente' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le attivita per l\'utente' });
    }
});

module.exports = router;
