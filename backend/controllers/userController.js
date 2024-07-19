const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Percorso del file JSON
const USERS_FILE = path.join(__dirname, '../data', 'users.json');

// Funzione per leggere il file users.json
async function readUsersFile() {
    try {
        const data = await fs.promises.readFile(USERS_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

// Funzione per scrivere nel file users.json
async function writeUsersFile(users) {
    await fs.promises.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Salva un nuovo utente
async function saveUser(user) {
    const users = await readUsersFile();
    users.push(user);
    await writeUsersFile(users);
}

// Trova un utente per username
async function findUserByUsername(username) {
    const users = await readUsersFile();
    return users.find(user => user.username === username);
}

// Ottiene tutti gli utenti
async function getAllUsers() {
    return await readUsersFile();
}

// Aggiunge un nuovo utente
async function addUser(username, password, firstName, lastName) {

    if (!username || !password || !firstName || !lastName) {
        throw new Error('Tutti i campi sono obbligatori');
    }

    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        throw new Error('Username già esistente');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User(username, hashedPassword, firstName, lastName);

    await saveUser(newUser);
}

async function deleteUser(username) {
    const users = await readUsersFile();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        throw new Error('Utente non trovato');
    }

    // Rimuovi l'utente dalla lista
    users.splice(userIndex, 1);
    await writeUsersFile(users);
}

async function updateUser(username, updatedData) {
    const users = await readUsersFile();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        throw new Error('Utente non trovato');
    }

    const user = users[userIndex];

    if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    Object.assign(user, updatedData);

    await writeUsersFile(users);
}

module.exports = {
    saveUser,
    findUserByUsername,
    getAllUsers,
    addUser,
    deleteUser,
    updateUser
};
