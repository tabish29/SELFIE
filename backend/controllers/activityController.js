const fs = require('fs');
const path = require('path');
const Activity = require('../models/activity');

const ACTIVITIES_FILE = path.join(__dirname, '../data', 'activities.json');


async function readActivitiesFile() {
    try {
        const data = await fs.promises.readFile(ACTIVITIES_FILE, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        } else {
            throw error;
        }
    }
}

async function writeActivitiesFile(activities) {
    await fs.promises.writeFile(ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
}

async function saveActivity(activity) {
    const activities = await readActivitiesFile();
    activities.push(activity);
    await writeActivitiesFile(activities);
}

async function findActivityByTitle(title) {
    const activities = await readActivitiesFile();
    return activities.find(activity => activity.title === title);
}

async function getAllActivities() {
    return await readActivitiesFile();
}

async function addActivity(title, dueDate, notes, authorUsername) {
    console.log("activityController: addActivity");
    if (!title || !dueDate || !authorUsername) {
        throw new Error('Title, dueDate, authorUsername are required');
    }

    /*
    const existingActivity = await findActivityByTitle(title);
    if (existingActivity) {
        throw new Error('Activity with this title already exists');
    }*/

    const newActivity = new Activity(
        title,
        dueDate,
        notes,
        authorUsername
    );

    await saveActivity(newActivity);
}


async function deleteActivity(title) {
    console.log("delete");
    const activities = await readActivitiesFile();
    const activityIndex = activities.findIndex(activity => activity.title === title);

    if (activityIndex === -1) {
        throw new Error('Attivita non trovata');
    }


    activities.splice(activityIndex, 1);
    await writeActivitiesFile(activities);
}

const updateActivity = async (title, updatedData) => {
    try {
        // Trova l'attività esistente in base al titolo
        const activity = await Activity.findOne({ title });

        if (!activity) {
            throw new Error('Attività non trovata');
        }

        // Aggiorna i campi con i dati forniti
        activity.title = updatedData.title || activity.title;
        activity.dueDate = updatedData.dueDate || activity.dueDate;
        activity.notes = updatedData.notes || activity.notes;
        activity.authorUsername = updatedData.authorUsername || activity.authorUsername;

        // Salva le modifiche nel database
        const updatedActivity = await activity.save();

        return updatedActivity;
    } catch (error) {
        console.error('Errore durante l\'aggiornamento dell\'attività:', error.message);
        throw error;
    }
};

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


async function getActivitiesPreview(length = 200) {
    const activities = await readActivitiesFile();
    return activities.map(activity => ({
        title: activity.title,
        preview: activity.content.length > length ? activity.content.substring(0, length) + '...' : activity.content
    }));
}

async function getActivitiesByAuthor(authorUsername) {
    const activities = await readActivitiesFile();
    return activities.filter(activity => activity.authorUsername === authorUsername);
    
}

module.exports = {
    saveActivity,
    findActivityByTitle,
    getAllActivities,
    addActivity,
    deleteActivity,
    //updateActivity,
    getActivitiesPreview,
    getActivitiesByAuthor,
    updateActivity 
};
