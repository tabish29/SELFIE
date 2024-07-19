const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare gli utenti' });
    }
});


router.post('/', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    
    try {
        await userController.addUser(username, password, firstName, lastName);
        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await userController.findUserByUsername(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Utente non trovato' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare l\'utente' });
    }
});


router.delete('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        await userController.deleteUser(username);
        res.status(200).json({ message: 'Utente eliminato con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.put('/:username', async (req, res) => {
    const { username } = req.params;
    const updatedData = req.body; 

    try {
        await userController.updateUser(username, updatedData);
        res.status(200).json({ message: 'Utente aggiornato con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
