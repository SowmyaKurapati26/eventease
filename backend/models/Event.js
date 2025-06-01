const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
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
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['conference', 'workshop', 'seminar', 'networking', 'other']
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
  maxAttendees: {
    type: Number,
    default: null
  },
  price: {
    type: Number,
    default: 0
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  image: {
    type: String,
    default: ''
  },
  registrationDeadline: {
    type: Date
  },
  additionalDetails: {
    type: Map,
    of: String,
    default: {}
  }
}, {
  timestamps: true
});

// Add index for efficient querying
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ organizer: 1 });

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function () {
  if (!this.maxAttendees) return false;
  return this.attendees.length >= this.maxAttendees;
});

// Method to check if user can register
eventSchema.methods.canRegister = function (userId) {
  if (this.isFull) return false;
  if (this.status !== 'upcoming') return false;
  if (this.registrationDeadline && new Date() > this.registrationDeadline) return false;
  return !this.attendees.includes(userId);
};

// Update event status based on date
eventSchema.methods.updateStatus = function () {
  const now = new Date();
  const eventDate = new Date(this.date);

  if (this.status === 'cancelled') return;

  if (eventDate < now) {
    this.status = 'completed';
  } else if (eventDate.toDateString() === now.toDateString()) {
    this.status = 'ongoing';
  } else {
    this.status = 'upcoming';
  }
};

// Pre-save middleware to update status
eventSchema.pre('save', function (next) {
  this.updateStatus();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
