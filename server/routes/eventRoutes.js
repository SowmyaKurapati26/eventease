const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEvent);
router.get('/calendar/:year/:month', eventController.getCalendarEvents);

// Protected routes
router.use(auth);
router.post('/', upload.single('image'), eventController.createEvent);
router.put('/:id', upload.single('image'), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.post('/:id/join', eventController.joinEvent);
router.post('/:id/leave', eventController.leaveEvent);
router.get('/organizer/:id', eventController.getOrganizerEvents);

module.exports = router; 