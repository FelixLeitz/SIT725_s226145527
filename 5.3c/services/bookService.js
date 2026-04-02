const bookItems = require('../models/bookModel');

async function getAllBooks() {
    const books = await bookItems.find();
    return books.map(book => book.toJSON());  // toJSON() applies getters
}

async function getBookById(id) {
    const book = await bookItems.findOne({ id });
    return book ? book.toJSON() : null;
}

module.exports = { getAllBooks, getBookById };