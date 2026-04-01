const bookService = require('../services/bookService');

exports.getAllBooks = (_req, res, next) => {
    try {
        const books = bookService.getAllBooks();
        res.status(200).json({
            statusCode: 200,
            message: 'Books retrieved successfully',
            data: books
        });
    } catch (error) {
        next(error);
    }
};

exports.getBookById = (req, res, next) => {
    try {
        const bookId = req.params.id;
        const book = bookService.getBookById(bookId);
        if (!book) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Book retrieved successfully',
            data: book
        });
    } catch (error) {
        next(error);
    }
};