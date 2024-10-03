const fs = require('fs');
const path = require('path');
const Event = require('../models/event');

const EVENTS_FILE = path.join(__dirname, '../data', 'events.json');


async function readEventsFile() {
    try {
        const data = await fs.promises.readFile(EVENTS_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

async function writeEventsFile(events) {
    await fs.promises.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
}

async function saveEvent(event) {
    const events = await readEventsFile();
    events.push(event);
    await writeEventsFile(events);
}

async function findEventByTitle(title) {
    const events = await readEventsFile();
    return events.find(event => event.title === title);
}

async function getAllEvents() {
    console.log("getAllEvents");
    return await readEventsFile();
}

async function addEvent(title, dateStart, dateEnd, place, notes, recurrence, recurrenceEnd, authorUsername) {
    if (!title || !dateStart || !dateEnd || !authorUsername) {
        throw new Error('Title, dateStart, dateEnd, authorUsername are required');
    }

    const existingEvent = await findEventByTitle(title);
    if (existingEvent) {
        throw new Error('Event with this title already exists');
    }

    const newEvent = new Event(
        title,
        dateStart,
        dateEnd,
        place,
        notes,
        recurrence,
        recurrenceEnd,
        authorUsername
    );

    await saveEvent(newEvent);
}


async function deleteEvent(authorUsername, title) {
    const events = await readEventsFile();
    const eventIndex = events.findIndex(event => event.title === title  && event.authorUsername === authorUsername);

    if (eventIndex === -1) {
        throw new Error('Evento non trovato');
    }


    events.splice(eventIndex, 1);
    await writeEventsFile(events);
}

async function getEventsByAuthor(authorUsername) {
    const events = await readEventsFile();
    return events.filter(event => event.authorUsername === authorUsername);
    
}

async function updateEvent(authorUsername, title, updatedData) {
    const events = await readEventsFile();
    const eventIndex = events.findIndex(event => event.title === title && event.authorUsername === authorUsername);

    if (eventIndex === -1) {
        throw new Error('Evento non trovato');
    }

    const event = events[eventIndex]; 

    console.log("evento: " + event.dateStart + event.dateEnd + event.place + event.notes + event.recurrence + event.recurrenceEnd);
    console.log("nuovi dati: " + updatedData.dateStart + updatedData.dateEnd + updatedData.place + updatedData.notes + updatedData.recurrence + updatedData.recurrenceEnd);
    
    event.dateStart = updatedData.dateStart;
    event.dateEnd = updatedData.dateEnd;
    event.place = updatedData.place || "";
    event.notes = updatedData.notes || "";
    event.recurrence = updatedData.recurrence || recurrence;
    event.recurrenceEnd = updatedData.recurrenceEnd || "";
    
    await writeEventsFile(events);
    
}

module.exports = {
    saveEvent,
    findEventByTitle,
    getAllEvents,
    addEvent,
    deleteEvent,
    getEventsByAuthor,
    updateEvent
};
