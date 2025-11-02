
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv')



module.exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create a new user - password will be hashed automatically by the pre-save hook in the User model
    const newUser = new User({
      email,
      password, // Pass plain password - pre-save hook will hash it
      role, // Assuming you have a 'role' field in your user schema
    });

    // Save the user to the database
    await newUser.save();
    
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role }, secretKey);

    // Set the JWT token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
      path: "/"
    });

    res.status(201).json({ message: 'Signup successful', user: { email: newUser.email, role: newUser.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in the database
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, secretKey, {
      expiresIn: '1d', // Token expiration time
    });

    // Set the JWT token in a cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
      path: "/"
    });

    // Set user data in the session (if using session)
    req.session.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      token,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.logout = async (req, res) => {
  // Clear the JWT cookie
  res.clearCookie('jwt', {
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    path: "/"
  });
  res.json({ message: 'Logout successful' });
};

// Password reset utility endpoint (for fixing affected users)
module.exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.filteredlt = async (req, res) => {
     const {startTime,endTime} = req.body
     try{
         const bookings = await Booking.find();
         bookings 
     }
     catch(err){

     }
};
