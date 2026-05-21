# Movie Booking Application

A full-featured web application for browsing movies and booking tickets online. Built with Node.js, Express, and MySQl.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🎬 Browse and search movies
- 🎫 Book movie tickets online
- 👤 User authentication and account management
- 💳 Secure payment processing
- 📅 View movie schedules and showtimes
- 🔍 Filter movies by genre, rating, and availability
- 📱 Responsive design for mobile and desktop
  

## Tech Stack

- **Frontend:**
  - JavaScript (92.9%)
  - EJS (7.1%)
  - HTML5
  - CSS3

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MYSQL (Sequelize}

- **Additional Tools:**
  - npm (package manager)

## Installation

### Prerequisites

- Node.js (v12.0 or higher)
- npm (v6.0 or higher)
- MYSQL (local or cloud instance)
- Git

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SHREYA-SNEHAL/Movie-booking-application.git
   cd Movie-booking-application
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add:
   ```
   PORT=3000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret_here
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Configuration

### Database Setup

The application uses MongoDB. You can:

- **Local MongoDB:** Install MongoDB locally and update `MONGODB_URI` in `.env`
- **MongoDB Atlas:** Use a cloud MongoDB instance and update the connection string

### Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
SESSION_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
```

## Usage

### For Users

1. Open the application in your browser
2. Create an account or log in
3. Browse available movies
4. Select a movie and showtime
5. Choose seats and complete booking
6. Make payment
7. Receive confirmation email

### For Administrators

- Access admin panel (if available)
- Manage movies and showtimes
- View bookings and revenue
- Manage users

## Project Structure

```
Movie-booking-application/
├── models/              # Database models
├── routes/              # Express routes
├── controllers/         # Business logic
├── views/               # EJS templates
├── public/              # Static files (CSS, images, client-side JS)
├── middleware/          # Custom middleware
├── config/              # Configuration files
├── app.js               # Main application file
├── server.js            # Server entry point
├── .env                 # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Project dependencies
└── README.md            # This file
```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create a new movie (admin)
- `PUT /api/movies/:id` - Update movie (admin)
- `DELETE /api/movies/:id` - Delete movie (admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/:id` - Get booking details
- `DELETE /api/bookings/:id` - Cancel booking

### Users
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Author:** [SHREYA-SNEHAL](https://github.com/SHREYA-SNEHAL)

**Last Updated:** May 2026

For questions or support, please open an issue on GitHub.
