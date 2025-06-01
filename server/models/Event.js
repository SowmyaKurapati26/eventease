const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    locationType: {
        type: String,
        enum: ['physical', 'online'],
        default: 'physical'
    },
    category: {
        type: String,
        enum: ['conference', 'workshop', 'seminar', 'networking', 'other'],
        required: true
    },
    maxAttendees: {
        type: Number,
        default: null
    },
    price: {
        type: Number,
        default: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    registrationDeadline: {
        type: Date
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema); 