const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Endpoint per ottenere tutti gli utenti
router.get('/', (req, res) => {
    const users = userController.getAllUsers();
    res.status(200).json(users);
});

// Endpoint per aggiungere un nuovo utente
router.post('/', (req, res) => {
    const { username, password, firstName, lastName } = req.body;
    
    try {
        userController.addUser(username, password, firstName, lastName);
        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Endpoint per ottenere un utente specifico (per username)
router.get('/:username', (req, res) => {
    const { username } = req.params;
    const user = userController.findUserByUsername(username);
    
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ error: 'Utente non trovato' });
    }
});


router.delete('/:username', (req, res) => {
    const { username } = req.params;
    try {
        userController.deleteUser(username);
        res.status(200).json({ message: 'Utente eliminato con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


router.put('/:username', (req, res) => {
    const { username } = req.params;
    const updatedData = req.body; 

    try {
        userController.updateUser(username, updatedData);
        res.status(200).json({ message: 'Utente aggiornato con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
