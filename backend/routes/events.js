const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for storing files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to update event statuses
const updateEventStatuses = async (events) => {
  const updatedEvents = [];
  for (const event of events) {
    event.updateStatus();
    if (event.isModified('status')) {
      await event.save();
    }
    updatedEvents.push(event);
  }
  return updatedEvents;
};

// Get all events with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      status,
      date,
      search,
      organizer,
      page = 1,
      limit = 10
    } = req.query;

    const query = { isPrivate: false };

    if (category) query.category = category;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (organizer) query.organizer = organizer;

    const skip = (page - 1) * limit;

    let events = await Event.find(query)
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Update event statuses
    events = await updateEventStatuses(events);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// Get events by calendar month
router.get('/calendar/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Base query for public events
    const query = {
      date: {
        $gte: startDate,
        $lte: endDate
      },
      isPrivate: false
    };

    // If user is authenticated, include their private events
    if (req.user) {
      query.$or = [
        { isPrivate: false },
        { organizer: req.user._id },
        { attendees: req.user._id }
      ];
      delete query.isPrivate;
    }

    let events = await Event.find(query).populate('organizer', 'firstName lastName');

    // Update event statuses
    events = await updateEventStatuses(events);

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching calendar events' });
  }
});

// Get user's events (created and attending)
router.get('/my-events', auth, async (req, res) => {
  try {
    let createdEvents = await Event.find({ organizer: req.user._id })
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName')
      .sort({ date: 1 });

    let attendingEvents = await Event.find({
      attendees: req.user._id,
      organizer: { $ne: req.user._id }
    })
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName')
      .sort({ date: 1 });

    // Update event statuses
    createdEvents = await updateEventStatuses(createdEvents);
    attendingEvents = await updateEventStatuses(attendingEvents);

    res.json({
      created: createdEvents,
      attending: attendingEvents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName email')
      .populate('attendees', 'firstName lastName');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update event status
    event.updateStatus();
    if (event.isModified('status')) {
      await event.save();
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// Create event (protected, organizer only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    // Check if user is an organizer
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }

    // Parse numeric values
    const eventData = {
      ...req.body,
      organizer: req.user._id,
      price: parseFloat(req.body.price) || 0,
      maxAttendees: req.body.maxAttendees ? parseInt(req.body.maxAttendees) : null,
      isPrivate: req.body.isPrivate === 'true',
      image: req.file ? req.file.filename : null
    };

    console.log('Creating event with data:', eventData);

    const event = new Event(eventData);
    await event.save();

    // Add to user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { eventsCreated: event._id }
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    // If there's an error and we uploaded a file, delete it
    if (req.file) {
      try {
        fs.unlinkSync(path.join(__dirname, '../../uploads/', req.file.filename));
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Update event (protected, organizer only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Parse the form data
    const updateData = {
      ...req.body,
      price: parseFloat(req.body.price) || 0,
      maxAttendees: req.body.maxAttendees ? parseInt(req.body.maxAttendees) : null,
      isPrivate: req.body.isPrivate === 'true'
    };

    // Handle date fields
    if (req.body.date) {
      updateData.date = new Date(req.body.date);
    }
    if (req.body.registrationDeadline) {
      updateData.registrationDeadline = new Date(req.body.registrationDeadline);
    }

    // Handle image update
    if (req.file) {
      // Delete old image if it exists
      if (event.image) {
        try {
          fs.unlinkSync(path.join(__dirname, '../../uploads/', event.image));
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      updateData.image = req.file.filename;
    }

    // Don't allow updating certain fields directly
    delete updateData.organizer;
    delete updateData.attendees;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    // If there's an error and we uploaded a file, delete it
    if (req.file) {
      try {
        fs.unlinkSync(path.join(__dirname, '../../uploads/', req.file.filename));
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// Delete event (protected, organizer only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove from user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { eventsCreated: req.params.id }
    });

    // Remove from all users' attending events
    await User.updateMany(
      { eventsAttending: req.params.id },
      { $pull: { eventsAttending: req.params.id } }
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

// Join event (protected)
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user can register
    if (!event.canRegister(req.user._id)) {
      return res.status(400).json({
        message: 'Cannot register for this event. It might be full, completed, or past registration deadline.'
      });
    }

    // Add user to attendees
    await Event.findByIdAndUpdate(req.params.id, {
      $push: { attendees: req.user._id }
    });

    // Add event to user's attending events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { eventsAttending: req.params.id }
    });

    const updatedEvent = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName');

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error joining event' });
  }
});

// Leave event (protected)
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is attending
    if (!event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Not registered for this event' });
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      return res.status(400).json({ message: 'Cannot leave a past or ongoing event' });
    }

    // Remove user from attendees
    await Event.findByIdAndUpdate(req.params.id, {
      $pull: { attendees: req.user._id }
    });

    // Remove event from user's attending events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { eventsAttending: req.params.id }
    });

    const updatedEvent = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName');

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error leaving event' });
  }
});

// Get event attendees (protected, organizer only)
router.get('/:id/attendees', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('attendees', 'firstName lastName email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view attendees' });
    }

    res.json(event.attendees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching attendees' });
  }
});

module.exports = router;
