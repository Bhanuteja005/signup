# MERN Stack Login System

Welcome to the **MERN Stack Login System**! This project is designed as a learning exercise to implement a secure user authentication and management system using the MERN (MongoDB, Express.js, React, Node.js) stack. It’s an ideal starting point for web developers looking to gain experience with user authentication processes and full-stack development.

## Features

1. **User Registration**: Users can sign up by providing their email and password.
2. **User Login**: Secure authentication using JWT tokens to authorize users.
3. **Profile Management**: Users can update their profile, including email, username, and profile picture.
4. **Password Recovery**: Users can recover their accounts via email-based OTP (One-Time Password) verification.
5. **Password Reset**: Reset forgotten passwords through a secure and simple process.
6. **Email Notifications**: Automatic email notifications for important account-related actions like registration and password resets.
7. **OTP Verification**: Enhanced security with OTP verification during password recovery.
8. **User Data Storage**: All user data, including login information and profiles, are securely stored in MongoDB.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

You need to have the following software installed:

- **Node.js**: To run the server and client-side JavaScript code.
- **MongoDB**: For database management.
- **Nodemon** (optional): For automatic server restarts during development.

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Bhanuteja005/signup
   cd signup
   ```

2. **Install server dependencies**:

   In the `server` directory, run:

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:

   In the `client` directory, run:

   ```bash
   cd client
   npm install
   ```

### Set Up Environment Variables

Create `.env` files in both the `server` and `client` directories. Below is an example setup for each.

#### Server `.env`:

```env
ATLAS_URI=your_mongodb_uri
JWT_SECRET_KEY=your_jwt_secret
EMAIL=your_email_address
EMAIL_PASSWORD=your_email_password
```

#### Client `.env`:

```env
VITE_SERVER_DOMAIN=http://localhost:5000/api
```

### Running the Application

1. **Start the server**:

   From the `server` directory, run:

   ```bash
   npm run dev
   ```

   This will start the Express.js server on the defined port (default: 5000).

2. **Start the client**:

   From the `client` directory, run:

   ```bash
   npm start
   ```

   This will launch the React application.

### Folder Structure

```bash
mern-login-system/
├── client/        # React front-end code
├── server/        # Express API and server-side logic
├── README.md      # Project documentation
└── package.json   # Main package dependencies
```

## Technologies Used

- **MongoDB**: NoSQL database for storing user data.
- **Express.js**: Back-end framework for handling HTTP requests.
- **React**: Front-end library for building user interfaces.
- **Node.js**: JavaScript runtime for the server-side code.
- **Axios**: For making HTTP requests from React to the API.
- **JWT (JSON Web Tokens)**: For secure user authentication.
- **Formik**: For form handling and validation in React.
- **Nodemailer**: For sending emails in the authentication process.
- **BCrypt.js**: For hashing user passwords.

## Future Enhancements

- **Social Media Login**: Integrate OAuth for Google, Facebook, etc.
- **Admin Dashboard**: Add an admin interface for user management.
- **Two-Factor Authentication (2FA)**: Enhance security with 2FA via SMS or app-based authentication.
  
## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

