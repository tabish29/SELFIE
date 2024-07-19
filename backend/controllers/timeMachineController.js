const fs = require('fs');
const path = require('path');
const TimeMachine = require('../models/timeMachine');
const TIMEMACHINES_FILE = path.join(__dirname, '../data', 'timeMachines.json');


async function readTimeMachinesFile() {
    try {
        const data = await fs.promises.readFile(TIMEMACHINES_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

async function writeTimeMachinesFile(timeMachines) {
    await fs.promises.writeFile(TIMEMACHINES_FILE, JSON.stringify(timeMachines, null, 2));
}

async function saveTimeMachine(timeMachine) {
    const timeMachines = await readTimeMachinesFile();
    timeMachines.push(timeMachine);
    await writeTimeMachinesFile(timeMachines);
}

async function findTimeMachineByOwner(machineOwner) {
    const timeMachines = await readTimeMachinesFile();
    return timeMachines.find(tm => tm.machineOwner === machineOwner);
}

async function getAllTimeMachines() {
    return await readTimeMachinesFile();
}

async function addTimeMachine(machineOwner, date) {
    if (!date || !machineOwner) {
        throw new Error('Tutti i campi sono obbligatori');
    }

    const existingTimeMachine = await findTimeMachineByOwner(machineOwner);
    if (existingTimeMachine) {
        throw new Error('Macchina del tempo già esistente per questo Utente');
    }

    const newTimeMachine = new TimeMachine(machineOwner, date);

    await saveTimeMachine(newTimeMachine);
}

async function deleteTimeMachine(machineOwner) {
    const timeMachines = await readTimeMachinesFile();
    const timeMachineIndex = timeMachines.findIndex(tm => tm.machineOwner === machineOwner);

    if (timeMachineIndex === -1) {
        throw new Error('Macchina del tempo non trovata');
    }

    timeMachines.splice(timeMachineIndex, 1);
    await writeTimeMachinesFile(timeMachines);
}

async function updateTimeMachine(machineOwner, updatedData) {
    const timeMachines = await readTimeMachinesFile();
    const timeMachineIndex = timeMachines.findIndex(tm => tm.machineOwner === machineOwner);

    if (timeMachineIndex === -1) {
        throw new Error('Macchina del tempo non trovata');
    }

    const timeMachine = timeMachines[timeMachineIndex];

    Object.assign(timeMachine, updatedData);

    await writeTimeMachinesFile(timeMachines);
}

module.exports = {
    saveTimeMachine,
    findTimeMachineByOwner,
    getAllTimeMachines,
    addTimeMachine,
    deleteTimeMachine,
    updateTimeMachine
};