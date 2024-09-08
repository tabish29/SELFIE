class UserNote {
    constructor(title, content, categories, createdAt, updatedAt, authorUsername, noteColor) {
        this.title = title;
        this.content = content;
        this.categories = categories;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorUsername = authorUsername;
        this.noteColor = noteColor;
    }

}

module.exports = UserNote;
