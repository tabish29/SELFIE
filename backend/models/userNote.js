class UserNote {
    constructor(title, content, categories, createdAt, updatedAt, authorUsername) {
        this.title = title;
        this.content = content;
        this.categories = categories;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.authorUsername = authorUsername;
    }

}

module.exports = UserNote;
