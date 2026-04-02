const mongoose = require('mongoose');

// Safe-Write Schema for Books with validation and custom ID format
const bookSchema = new mongoose.Schema({
    // Custom unique ID in specified format
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        match: [/^b\d+$/, 'ID must start with b followed by digits e.g. b1, b12']
    },
    title: {
        type: String,
        minlength: 1,
        maxlength: 1024,
        required: true,
        trim: true
    },
    author: {
        type: String,
        minlength: 1,
        maxlength: 1024,
        required: true,
        trim: true
    },
    // Year must be a positive integer and not in the future
    year: {
        type: Number,
        min: [0, 'Year must be a positive integer'],
        max: [new Date().getFullYear(), 'Year cannot be in the future'],
        required: true
    },
    genre: {
        type: String,
        minlength: 1,
        maxlength: 256,
        required: true
    },
    // More than one page summary ~4000 chars is excessive
    summary: {
        type: String,
        minlength: 20,
        maxlength: 4096,
        required: true,
        trim: true
    },
    // Price must be a positive decimal number
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        // convert Decimal128 to js compatible float for validation
        validate: {
            validator: function (v) {
                return parseFloat(v) > 0;
            },
            message: props => `${props.value} is not a valid price! Price must be a positive number.`
        },
        get: v => v?.toString()
    },
    // Currency must be known
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
        required: true,
        uppercase: true,
        trim: true   
    }
}, {
    // Throw errors on invalid data instead of silently ignoring it
    strict: 'throw', 
    toJSON: {
        getters: true,
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
}
)

module.exports = mongoose.model('Book', bookSchema);