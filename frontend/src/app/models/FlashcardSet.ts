import { Flashcard } from "./Flashcard";

export class FlashcardSet {
    constructor(
        public author: string,
        public topic: string,
        public flashcards: Flashcard[]
    ) { }

}