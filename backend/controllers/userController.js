const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Percorso del file JSON
const USERS_FILE = path.join(__dirname, '../data', 'users.json');

// Funzione per leggere il file users.json
function readUsersFile() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
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
function writeUsersFile(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Salva un nuovo utente
function saveUser(user) {
    const users = readUsersFile();
    users.push(user);
    writeUsersFile(users);
}

// Trova un utente per username
function findUserByUsername(username) {
    const users = readUsersFile();
    return users.find(user => user.username === username);
}

// Ottiene tutti gli utenti
function getAllUsers() {
    return readUsersFile();
}

// Aggiunge un nuovo utente
async function addUser(username, password, firstName, lastName) {
    // Controlla che i parametri siano diversi da null
    if (!username || !password || !firstName || !lastName) {
        throw new Error('Tutti i campi sono obbligatori');
    }

    // Controlla se l'username esiste già
    if (findUserByUsername(username)) {
        throw new Error('Username già esistente');
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente
    const newUser = new User(username, hashedPassword, firstName, lastName);

    // Salva il nuovo utente nel file JSON
    saveUser(newUser);
}

async function deleteUser(username) {
    const users = readUsersFile();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        throw new Error('Utente non trovato');
    }

    // Rimuovi l'utente dalla lista
    users.splice(userIndex, 1);
    writeUsersFile(users);
}

async function updateUser(username, updatedData) {
    const users = readUsersFile();
    const userIndex = users.findIndex(user => user.username === username);

    if (userIndex === -1) {
        throw new Error('Utente non trovato');
    }

    const user = users[userIndex];

    // Se c'è una nuova password, criptala
    if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    // Aggiorna solo i campi presenti nel corpo della richiesta
    Object.assign(user, updatedData);

    // Scrivi di nuovo nel file JSON
    writeUsersFile(users);
}

module.exports = {
    saveUser,
    findUserByUsername,
    getAllUsers,
    addUser,
    deleteUser,
    updateUser
};
