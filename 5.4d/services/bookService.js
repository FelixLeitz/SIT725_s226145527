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

    return book.toJSON();
}

async function createBook(bookData) {
    const newBook = new bookItems(bookData);
    
    // Validate and save the new book to the database
    await newBook.save();

    // Return the created book as JSON
    return newBook.toJSON();
}

async function updateBook(id, bookData) {
    // Reject id changes with 400
    if (bookData.id) {
        const error = new Error('ID is immutable and cannot be changed');
        error.statusCode = 400;
        throw error;
    }

    const updatedBook = await bookItems.findOneAndUpdate(
        { id }, bookData, { 
            returnDocument: 'after', // return the updated document
            runValidators: true, // ensure validators run on update
            context: 'query' // needed for some validators to work properly during update operations
        }
    );
    
    if (!updatedBook) {
        const error = new Error(`Book with id ${id} not found`);
        error.statusCode = 404;
        throw error;
    }
    return updatedBook.toJSON();
}

module.exports = { getAllBooks, getBookById, createBook, updateBook };