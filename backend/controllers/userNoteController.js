const fs = require('fs');
const path = require('path');
const UserNote = require('../models/userNote');

const NOTES_FILE = path.join(__dirname, '../data', 'userNotes.json');


async function readNotesFile() {
    try {
        const data = await fs.promises.readFile(NOTES_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

async function writeNotesFile(notes) {
    await fs.promises.writeFile(NOTES_FILE, JSON.stringify(notes, null, 2));
}

async function saveNote(note) {
    const notes = await readNotesFile();
    notes.push(note);
    await writeNotesFile(notes);
}

async function findNoteByTitle(title) {
    const notes = await readNotesFile();
    return notes.find(note => note.title === title);
}

async function findNoteByAuthorAndTitle(authorUsername, title) {
    const notes = await readNotesFile();

    return notes.find(note => note.title === title && note.authorUsername === authorUsername);
}

async function getAllNotes() {
    return await readNotesFile();
}

async function addNote(title, content, categories, createdAt, updatedAt, authorUsername) {
    if (!title || !content || !authorUsername || !createdAt || !updatedAt) {
        throw new Error('Title, content, categories,authorUsername, createdAt, and updatedAt are required');
    }

    const existingNote = await findNoteByAuthorAndTitle(authorUsername, title);
    if (existingNote) {
        throw new Error('Esiste già una nota con questo titolo');
    }

    const newNote = new UserNote(
        title,
        content,
        categories,
        createdAt,
        updatedAt,
        authorUsername
    );

    await saveNote(newNote);
}

async function deleteNote(authorUsername, title) {
    const notes = await readNotesFile();
    const noteIndex = notes.findIndex(note => note.title === title && note.authorUsername === authorUsername);

    if (noteIndex === -1) {
        throw new Error('Nota non trovata');
    }


    notes.splice(noteIndex, 1);
    await writeNotesFile(notes);
}

async function updateNote(authorUsername, title, updatedData) {
    const notes = await readNotesFile();
    const noteIndex = notes.findIndex(note => note.title === title && note.authorUsername === authorUsername);

    if (noteIndex === -1) {
        throw new Error('Nota non trovata');
    }

    const note = notes[noteIndex];

    if (updatedData.content) {
        note.content = updatedData.content;
        note.updatedAt = new Date();
    }

    Object.assign(note, updatedData);

    await writeNotesFile(notes);
}

async function getNotesPreview(length = 200) {
    const notes = await readNotesFile();
    return notes.map(note => ({
        title: note.title,
        preview: note.content.length > length ? note.content.substring(0, length) + '...' : note.content
    }));
}

async function getNotesByAuthor(authorUsername) {
    const notes = await readNotesFile();
    return notes.filter(note => note.authorUsername === authorUsername);
}

module.exports = {
    saveNote,
    findNoteByTitle,
    getAllNotes,
    addNote,
    deleteNote,
    updateNote,
    getNotesPreview,
    getNotesByAuthor
};