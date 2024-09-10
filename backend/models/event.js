class Event {
    constructor(title, dateStart, dateEnd, notes, authorUsername){
        this.title = title;
        this.dateStart = dateStart
        this.dateEnd = dateEnd,
        this.notes = notes,
        this.authorUsername = authorUsername;

    }
}

module.exports = Event;
