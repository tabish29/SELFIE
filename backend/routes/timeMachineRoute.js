const express = require('express');
const router = express.Router();
const timeMachineController = require('../controllers/timemachinecontroller');


router.get('/', async (req, res) => {
    try {
        const timeMachines = await timeMachineController.getAllTimeMachines();
        res.status(200).json(timeMachines);
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare le macchine del tempo' });
    }
});

router.post('/', async (req, res) => {
    const { machineOwner, date  } = req.body;
    
    try {
        await timeMachineController.addTimeMachine(machineOwner, date);
        res.status(201).json({ message: 'Macchina del tempo aggiunta con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:machineOwner', async (req, res) => {
    const { machineOwner } = req.params;
    try {
        const timeMachine = await timeMachineController.findTimeMachineByOwner(machineOwner);
        if (timeMachine) {
            res.status(200).json(timeMachine);
        } else {
            res.status(404).json({ error: 'Macchina del tempo non trovata' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore nel recuperare la macchina del tempo' });
    }
});

router.delete('/:machineOwner', async (req, res) => {
    const { machineOwner } = req.params;
    try {
        await timeMachineController.deleteTimeMachine(machineOwner);
        res.status(200).json({ message: 'Macchina del tempo eliminata con successo' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.put('/:machineOwner', async (req, res) => {
    const { machineOwner } = req.params;
    const updatedData = req.body;

    try {
        await timeMachineController.updateTimeMachine(machineOwner, updatedData);
        res.status(200).json({ message: 'Macchina del tempo aggiornata con successo' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;