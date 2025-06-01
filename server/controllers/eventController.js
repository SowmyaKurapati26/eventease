const Event = require('../models/Event');
const fs = require('fs').promises;
const path = require('path');

// Helper function to delete old image
const deleteOldImage = async (filename) => {
    if (!filename) return;
    try {
        await fs.unlink(path.join(__dirname, '../../uploads/', filename));
    } catch (error) {
        console.error('Error deleting old image:', error);
    }
};

exports.createEvent = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user.id,
            image: req.file ? req.file.filename : null
        };

        const event = new Event(eventData);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        // If there's an error and we uploaded a file, delete it
        if (req.file) {
            await deleteOldImage(req.file.filename);
        }
        res.status(400).json({ message: error.message });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        const updateData = { ...req.body };

        // Handle image update
        if (req.file) {
            // Delete old image if it exists
            await deleteOldImage(event.image);
            updateData.image = req.file.filename;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        // If there's an error and we uploaded a file, delete it
        if (req.file) {
            await deleteOldImage(req.file.filename);
        }
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the organizer
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        // Delete the associated image if it exists
        await deleteOldImage(event.image);

        await event.remove();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email');

        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is already registered
        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        // Check if event is full
        if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.attendees.push(req.user.id);
        await event.save();

        const updatedEvent = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email');

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.leaveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const attendeeIndex = event.attendees.indexOf(req.user.id);
        if (attendeeIndex === -1) {
            return res.status(400).json({ message: 'Not registered for this event' });
        }

        event.attendees.splice(attendeeIndex, 1);
        await event.save();

        const updatedEvent = await Event.findById(req.params.id)
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email');

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCalendarEvents = async (req, res) => {
    try {
        const { year, month } = req.params;
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        // Base query for date range
        const query = {
            date: {
                $gte: startDate,
                $lte: endDate
            }
        };

        // If user is authenticated, include their private events
        if (req.user) {
            query.$or = [
                { isPrivate: false },
                { organizer: req.user._id },
                { attendees: req.user._id }
            ];
        } else {
            // If not authenticated, only show public events
            query.isPrivate = false;
        }

        const events = await Event.find(query)
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email')
            .sort({ date: 1, time: 1 });

        res.json(events);
    } catch (error) {
        console.error('Calendar events error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getOrganizerEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.params.id })
            .populate('organizer', 'firstName lastName email')
            .populate('attendees', 'firstName lastName email');
        res.json({ events });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 