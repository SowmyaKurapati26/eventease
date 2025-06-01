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
  const eventDateTime = new Date(this.date);
  const [hours, minutes] = this.time.split(':').map(Number);
  eventDateTime.setHours(hours, minutes);

  if (this.status === 'cancelled') return;

  // If event date is in the past
  if (eventDateTime < now) {
    this.status = 'completed';
  }
  // If event is today
  else if (eventDate.toDateString() === now.toDateString()) {
    // If event time has passed
    if (eventDateTime < now) {
      this.status = 'completed';
    }
    // If event is currently happening (within a 2-hour window)
    else if (eventDateTime.getTime() - now.getTime() <= 2 * 60 * 60 * 1000) {
      this.status = 'ongoing';
    }
    // If event is today but hasn't started yet
    else {
      this.status = 'upcoming';
    }
  }
  // If event is in the future
  else {
    this.status = 'upcoming';
  }
};

// Pre-save middleware to update status
eventSchema.pre('save', function (next) {
  this.updateStatus();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
