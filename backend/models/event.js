class Event {
    constructor(title, dateStart, dateEnd, place, notes, recurrence, recurrenceEnd, authorUsername){
        this.title = title;
        this.dateStart = dateStart
        this.dateEnd = dateEnd,
        this.place = place,
        this.notes = notes,
        this.recurrence = recurrence,
        this.recurrenceEnd = recurrenceEnd,
        this.authorUsername = authorUsername;

    }
}

module.exports = Event;
