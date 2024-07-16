const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(bodyParser.json());
app.use(cors()); 

// Route per la registrazione degli utenti
app.post('/api/register', (req, res) => {
    console.log('Dati ricevuti:', req.body);
    const { username, password, firstName, lastName } = req.body;

    // Controlla che tutti i campi siano presenti
    if (!username || !password || !firstName || !lastName) {
        return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    // Leggi il file users.json
    fs.readFile(USERS_FILE, (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Errore nella lettura del file' });
        }

        const users = data ? JSON.parse(data) : [];

        // Controlla se l'username esiste già
        if (users.find(user => user.username === username)) {
            return res.status(400).json({ error: 'Username già esistente' });
        }

        // Aggiungi il nuovo utente
        users.push({ username, password, firstName, lastName });

        // Scrivi il nuovo elenco di utenti nel file
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({ error: 'Errore nella scrittura del file' });
            }

            res.status(201).json({ message: 'Registrazione avvenuta con successo' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
});