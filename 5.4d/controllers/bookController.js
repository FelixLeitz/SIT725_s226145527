const bookService = require('../services/bookService');

// Controller functions for retrieving all books from the database
exports.getAllBooks = async (_req, res, next) => {
    try {
        const books = await bookService.getAllBooks();
        // Return consistent response structure with custom status code, message, and data        
        res.status(200).json({
            statusCode: 200,
            message: 'Books retrieved successfully',
            data: books
        });
    // Catch any unexpected errors and pass to error handling middleware
    } catch (error) {
        next(error);
    }
};

// Controller function for retrieving a single book by ID
exports.getBookById = async (req, res, next) => {
    try {
        const book = await bookService.getBookById(req.params.id);
        res.status(200).json({
            statusCode: 200,
            message: 'Book retrieved successfully',
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// Controller function for creating a new book
exports.createBook = async (req, res, next) => {
    try {
        const bookData = req.body;
        const newBook = await bookService.createBook(bookData);
        res.status(201).json({
            statusCode: 201,
            message: 'Book created successfully',
            data: newBook
        });
    } catch (error) {
        next(error);
    }
};

// Controller function for updating an existing book
exports.updateBook = async (req, res, next) => {
    try {
        const bookData = req.body;
        const updatedBook = await bookService.updateBook(req.params.id, bookData);
        res.status(200).json({
            statusCode: 200,
            message: 'Book updated successfully',
            data: updatedBook
        });
    } catch (error) {
        next(error);
    }
}