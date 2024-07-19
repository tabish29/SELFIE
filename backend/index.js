const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const timeMachineRoutes = require('./routes/timeMachineRoute');
const userNoteRoutes = require('./routes/userNoteRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Usa le route definite in userRoutes.js con prefisso /users
app.use('/users', userRoutes);

app.use('/timeMachines', timeMachineRoutes);

app.use('/userNotes', userNoteRoutes);

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta http://localhost:${PORT}`);
});