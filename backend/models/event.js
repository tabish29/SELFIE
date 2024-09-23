class Event {
    constructor(title, dateStart, dateEnd, notes, recurrence, authorUsername){
        this.title = title;
        this.dateStart = dateStart
        this.dateEnd = dateEnd,
        this.notes = notes,
        this.recurrence = recurrence,
        this.authorUsername = authorUsername;

    }
}

module.exports = Event;
