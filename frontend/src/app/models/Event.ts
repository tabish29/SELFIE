export class Event {


    constructor(
        public title: string,
        public dateStart: Date,
        public dateEnd: Date,
        public place: string,
        public notes: string,
        public recurrence: string,
        public recurrenceEnd: Date,
        public authorUsername: string) {

    }
}
