export class Event {


    constructor(
        public title: string,
        public dateStart: Date,
        public dateEnd: Date,
        //luogo
        public notes: string,
        public recurrence: string,
        //fine ripetizione
        public authorUsername: string) {

    }
}
