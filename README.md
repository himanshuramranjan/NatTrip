## NatTrip

The "NatTrip" project is an application that allows users to explore and book nature trips and tours. It provides a platform where users can discover various natural destinations, view tour details, read reviews, make bookings, and manage their bookings. The project aims to connect nature enthusiasts with tour providers and create a seamless booking experience for users.
The application is built using Node.js and Express.js on the backend, with MongoDB as the database. It follows a RESTful API architecture and utilizes various technologies and libraries such as Mongoose for database modeling, bcryptjs for password encryption, JWT for authentication, and dotenv for environment variable management.

### Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Dependencies](#dependencies)
- [Author](#author)

### Description

This Node.js project is a booking application that allows users to explore and book various natural tours and trips. It provides functionalities for managing tours, users, bookings, and reviews.

### Installation

1. Clone the repository:

   ```shell
   git clone <repository_url>
   ```

2. Install the dependencies:

   ```shell
   npm install
   ```

### Configuration

1. Create a `.env` file in the project root directory.
2. Add the following environment variables in the `.env` file:

   ```plaintext
   DATABASE=<your_database_connection_string>
   PASSWORD=<your_database_password>
   ```

### Usage

1. Start the server:

   ```shell
   nodemon server.js
   ```

2. Access the application through the following URL:

   ```plaintext
   http://localhost:8080
   ```

### API Routes

- **Tours**: `/api/v1/nattrip/tours`
  - `GET /` - Get all tours.
  - `GET /top-cheap-tours` - Get top cheap tours.
  - `POST /` - Create a new tour.
  - `GET /:id` - Get a specific tour.
  - `PATCH /:id` - Update a specific tour.
  - `DELETE /:id` - Delete a specific tour.
  - `GET /tours-stats` - Get tour statistics.
  - `GET /monthly-tour-plans/:year` - Get monthly tour plans for a specific year.

- **Users**: `/api/v1/nattrip/users`
  - `POST /signup` - User sign up.
  - `POST /login` - User login.
  - `POST /forgotPassword` - Forgot password request.
  - `POST /resetPassword/:token` - Reset password.
  - `GET /me` - Get current user's details.
  - `PATCH /updateMe` - Update current user's details.
  - `DELETE /deleteMe` - Delete current user's account.
  - `PATCH /updatePassword` - Update current user's password.
  - `POST /logout` - User logout.
  - `GET /` - Get all users (admin-only).
  - `POST /` - Create a new user (admin-only).
  - `GET /:id` - Get a specific user (admin-only).
  - `DELETE /:id` - Delete a specific user (admin-only).
  - `PATCH /:id` - Update a specific user (admin-only).

- **Reviews**: `/api/v1/nattrip/reviews`
  - `GET /` - Get all reviews.
  - `POST /` - Create a new review.
  - `GET /:id` - Get a specific review.
  - `PATCH /:id` - Update a specific review.
  - `DELETE /:id` - Delete a specific review.

- **Bookings**: `/api/v1/nattrip/bookings`
  - `GET /` - Get all bookings (admin-only).
  - `POST /` - Create a new booking (user-only).
  - `GET /:id - Get a specific booking.
  - `PATCH /:id` - Update a specific booking.
  - `DELETE /:id` - Delete a specific booking.


### Dependencies

- bcryptjs: ^2.4.3
- dotenv: ^16.0.3
- express: ^4.18.2
- jsonwebtoken: ^9.0.0
- mongoose: ^5.13.17
- nodemon: ^2.0.22
- validator: ^13.9.0

### Author

Himanshuram Ranjan