/**
 * Utility script to fix users with double-hashed passwords
 * 
 * IMPORTANT: This script helps identify users with potentially double-hashed passwords.
 * Since we cannot "unhash" a password, affected users will need to reset their passwords.
 * 
 * Usage: node utils/fixDoubleHashedPasswords.js
 */

require("dotenv").config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("DB connected successfully");
  } catch (err) {
    console.log("DB connection failed!");
    console.error(err.message);
    process.exit(1);
  }
}

/**
 * Check if a password hash looks like it might be double-hashed
 * This is a heuristic - we check if the hash looks unusually long
 */
function mightBeDoubleHashed(hash) {
  // Normal bcrypt hashes are about 60 characters
  // A double-hashed password would be longer, but we can't reliably detect this
  // This function is mainly for documentation purposes
  return hash.length > 60;
}

/**
 * Main function to analyze and report on users
 */
async function analyzeUsers() {
  try {
    await connectDB();
    
    const users = await User.find({});
    console.log(`\nFound ${users.length} users in database\n`);
    
    let potentiallyAffected = [];
    
    for (const user of users) {
      const hash = user.password;
      
      // Check if hash looks suspicious
      if (hash && hash.startsWith('$2')) {
        // This is a bcrypt hash - could be single or double hashed
        // We can't reliably tell, but we'll note it
        potentiallyAffected.push({
          email: user.email,
          hashLength: hash.length,
          note: 'Has bcrypt hash - verify manually if login fails'
        });
      }
    }
    
    if (potentiallyAffected.length > 0) {
      console.log('Users that may need password reset:');
      console.log('=====================================');
      potentiallyAffected.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Hash length: ${user.hashLength} characters`);
        console.log(`   Note: ${user.note}\n`);
      });
      
      console.log('\n⚠️  IMPORTANT:');
      console.log('If users cannot login with correct passwords, they need to reset their passwords.');
      console.log('You can use the password reset endpoint or manually reset passwords.\n');
    } else {
      console.log('✅ All users appear to have properly formatted password hashes.\n');
    }
    
    await mongoose.connection.close();
    console.log('Analysis complete. Database connection closed.');
    
  } catch (error) {
    console.error('Error analyzing users:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the analysis
analyzeUsers();

