export class Activity {


    constructor(
        public title: string,
        public dueDate: Date | null,
        public notes: string,
        public authorUsername: string | null) {

    }
}
