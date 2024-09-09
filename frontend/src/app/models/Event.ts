export class Event {


    constructor(
        public title: string,
        public dateStart: Date,
        public dateEnd: Date,
        //luogo
        public notes: string,
        //ripetizione
        //fine ripetizione
        public authorUsername: string) {

    }
}
