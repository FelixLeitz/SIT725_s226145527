const bookItems = require('../models/bookModel');

async function getAllBooks() {
    const books = await bookItems.find();

    // If the database is empty, throw an error with 404 status code
    if (!books || books.length === 0) {
        const error = new Error('No books found');
        error.statusCode = 404;
        throw error;
    }

    return books.map(book => book.toJSON()); 
}

async function getBookById(id) {
    const book = await bookItems.findOne({ id });
    
    // If book not found, throw an error with 404 status code
    if (!book) {
        const error = new Error(`Book with id ${id} not found`);
        error.statusCode = 404;
        throw error;
    }

    return book.toJSON();
}

async function createBook(bookData) {
    const newBook = new bookItems(bookData);
    // Save the new book to the database (this will also trigger validation and throw errors up the chain if the data is invalid)
    await newBook.save();
    return newBook.toJSON();
}

async function updateBook(id, bookData) {
    const updatedBook = await bookItems.findOneAndUpdate({ id }, bookData, { runValidators: true });
    
    if (!updatedBook) {
        const error = new Error(`Book with id ${id} not found`);
        error.statusCode = 404;
        throw error;
    }
    return updatedBook.toJSON();
}

module.exports = { getAllBooks, getBookById, createBook, updateBook };