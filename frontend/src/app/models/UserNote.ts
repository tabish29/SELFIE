export class UserNote {


    constructor(
        public title: string,
        public content: string,
        public categories: string[],
        public createdAt: string,
        public updatedAt: string,
        public authorUsername: string | null) {

    }
}
