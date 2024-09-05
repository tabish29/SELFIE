export class Activity {


    constructor(
        public title: string,
        public dueDate: Date | null,
        //public dueDate: string,
        public notes: string,
        public authorUsername: string | null) {

    }
}
