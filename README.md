# Event Management System

A modern, full-stack event management platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows organizers to create and manage events while enabling participants to discover and register for events.

![Event Management System](public/demo.jpg)

## 🌟 Features

### For Organizers
- Create and manage events with detailed information
- Track event registrations and participant lists
- Update event details and status
- View event analytics and attendance
- Manage multiple events through a dedicated dashboard

### For Participants
- Browse and search for events
- Register for events with a simple click
- View registered events in calendar format
- Track upcoming and past event attendance
- Receive event updates and notifications

### General Features
- 🔐 Secure user authentication and authorization
- 📱 Responsive design for all devices
- 📅 Interactive calendar view
- 🔍 Advanced search and filtering options
- 📊 Real-time updates and notifications

## 🛠️ Technology Stack

### Frontend
- **React.js** (v18) - Modern UI development
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Radix UI** - Accessible UI components
- **Axios** - HTTP client
- **Zod** - Schema validation
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/event-management.git
   cd event-management
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # In backend directory, create .env file
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000

   # In root directory, create .env file
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend development server (from root directory)
   npm run dev
   ```

## 🏗️ Project Structure

```
event-management/
├── src/                    # Frontend source files
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── backend/               # Backend source files
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── public/               # Static files
```

## 🔑 Key Features Implementation

### User Authentication
- JWT-based authentication
- Role-based access control (Organizer/Participant)
- Secure password hashing
- Protected routes

### Event Management
- CRUD operations for events
- File upload for event images
- Event status management
- Participant registration tracking

### Search and Filter
- Full-text search for events
- Category-based filtering
- Date range filtering
- Status-based filtering

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/my-events` - Get user's events

## 🔒 Security Features

- Password hashing using bcrypt
- JWT for secure authentication
- Protected API endpoints
- Input validation and sanitization
- CORS configuration
- Rate limiting

## 🚀 Deployment

The application can be deployed using various platforms:

1. **Frontend**
   - Vercel
   - Netlify
   - GitHub Pages

2. **Backend**
   - Heroku
   - DigitalOcean
   - AWS

3. **Database**
   - MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
