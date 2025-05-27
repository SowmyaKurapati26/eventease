const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isPrivate: false })
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName')
      .sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName')
      .populate('attendees', 'firstName lastName');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
});

// Create event (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, date, time, location, category, price, maxAttendees, isPrivate } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      price,
      maxAttendees,
      isPrivate,
      organizer: req.user._id
    });

    await event.save();
    
    // Add to user's created events
    await User.findByIdAndUpdate(req.user._id, {
      $push: { eventsCreated: event._id }
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'firstName lastName');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating event' });
  }
});

// Update event (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('organizer', 'firstName lastName')
     .populate('attendees', 'firstName lastName');

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// Delete event (protected)
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

    // Check if user is already attending
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
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
    res.status(500.json({ message: 'Server error leaving event' });
  }
});

module.exports = router;
