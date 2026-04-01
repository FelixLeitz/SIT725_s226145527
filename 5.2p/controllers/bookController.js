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