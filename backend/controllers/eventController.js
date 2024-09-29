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


async function deleteEvent(title) {
    console.log("delete");
    const events = await readEventsFile();
    const eventIndex = events.findIndex(event => event.title === title);

    if (eventIndex === -1) {
        throw new Error('Evento non trovato');
    }


    events.splice(eventIndex, 1);
    await writeEventsFile(events);
}

/*
async function updateActivity(title, updatedData) {
    const activities = await readActivitiesFile();
    const activityIndex = activities.findIndex(activity => activity.title === title);

    if (noteIndex === -1) {
        throw new Error('Attivita non trovata');
    }

    const activity = activities[activityIndex];


    if (updatedData.content) {
        activity.content = updatedData.content;
        activity.updatedAt = new Date();
    }


    Object.assign(activity, updatedData);

    await writeActivitiesFile(activities);
}*/

/*
async function getEventsPreview(length = 200) {
    const events = await readEventsFile();
    return events.map(activity => ({
        title: event.title,
        preview: event.content.length > length ? event.content.substring(0, length) + '...' : event.content
    }));
}*/

async function getEventsByAuthor(authorUsername) {
    const events = await readEventsFile();
    return events.filter(event => event.authorUsername === authorUsername);
    
}

const updateEvent = async (title, updatedData) => {
    try {
        // Cerca l'evento da aggiornare in base al titolo
        const event = await Event.findOne({ title });

        if (!event) {
            throw new Error('Evento non trovato');
        }

        // Aggiorna i campi con i dati forniti, o mantieni quelli esistenti se non sono stati passati
        event.title = updatedData.title || event.title;
        event.dateStart = updatedData.dateStart || event.dateStart;
        event.dateEnd = updatedData.dateEnd || event.dateEnd;
        event.place = updatedData.place || event.place;
        event.notes = updatedData.notes || event.notes;
        event.recurrence = updatedData.recurrence || event.recurrence;
        event.recurrenceEnd = updatedData.recurrenceEnd || event.recurrenceEnd;
        event.authorUsername = updatedData.authorUsername || event.authorUsername;

        // Salva l'evento aggiornato nel database
        const updatedEvent = await event.save();

        return updatedEvent;
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'evento:', error.message);
        throw error;
    }
};

module.exports = {
    saveEvent,
    findEventByTitle,
    getAllEvents,
    addEvent,
    deleteEvent,
    //updateActivity,
    //getEventsPreview,
    getEventsByAuthor,
    updateEvent
};
