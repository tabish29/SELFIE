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

router.put('/:title', async (req, res) => {
    const { title } = req.params; // Titolo passato nell'URL
    const updatedData = req.body; // Dati dell'attività aggiornati passati nel body della richiesta

    try {
        // Verifica se il titolo esiste nel body (opzionale)
        if (!updatedData.title || !updatedData.dueDate || !updatedData.authorUsername) {
            throw new Error('Inserire tutti i campi obbligatori');
        }

        // Chiamata al controller per aggiornare l'attività con il titolo specificato
        const updatedActivity = await activityController.updateActivity(title, updatedData);

        // Se l'attività è stata aggiornata con successo
        res.status(200).json({ message: 'Attività aggiornata con successo', activity: updatedActivity });
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'attività:', error.message);
        res.status(400).json({ error: error.message });
    }
});

/* serve?
router.get('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const activity = await activityController.findActivityByTitle(title);
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ error: 'Attivita non trovata' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare la attivita' });
    }
});*/


router.delete('/:title', async (req, res) => {
    const { title } = req.params;
    try {
        await activityController.deleteActivity(title);
        res.status(200).json({ message: 'Attivita eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

/*
router.put('/:title', async (req, res) => {
    const { title } = req.params;
    const updatedData = req.body;

    try {
        await acctivityController.updateActivity(title, updatedData);
        res.status(200).json({ message: 'Attivita aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});*/

/*
router.get('/previews', async (req, res) => {
    const length = parseInt(req.query.length) || 200;
    try {
        const previews = await activityController.getActivitiesPreview(length);
        res.status(200).json(previews);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le preview delle attivita' });
    }
});*/


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
