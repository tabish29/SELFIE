const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');
const timeMachineRoutes = require('./routes/timeMachineRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Usa le route definite in userRoutes.js con prefisso /users
app.use('/users', userRoutes);

app.use('/timeMachines', timeMachineRoutes);

app.listen(PORT, () => {
    console.log(`Server avviato sulla porta http://localhost:${PORT}`);
});