const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoute');
const timeMachineRoutes = require('./routes/timeMachineRoute');
const userNoteRoutes = require('./routes/userNoteRoute');
const wordRoutes = require('./routes/wordRoute');
const activityRoutes = require('./routes/activityRoute');
const eventRoutes = require('./routes/eventRoute');
const flashCardRoutes= require('./routes/flashCardRoute');
const musicRoutes= require('./routes/musicRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());


app.use('/users', userRoutes);

app.use('/timeMachines', timeMachineRoutes);

app.use('/userNotes', userNoteRoutes);

app.use('/words', wordRoutes);

app.use('/activities', activityRoutes);

app.use('/events', eventRoutes);

app.use('/flashcards', flashCardRoutes);

app.use('/musics', musicRoutes);

app.use('/music', express.static(path.join(__dirname, 'data/musics')));


app.listen(PORT, () => {
    console.log(`Server avviato sulla porta http://localhost:${PORT}`);
});