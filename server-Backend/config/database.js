const mongoose = require('mongoose');

exports.connectDB = () => {
  const mongoURI = process.env.MONGODB_URL;
  
  if (!mongoURI) {
    console.error("ERROR: MONGODB_URL is not defined in .env file!");
    console.error("Please create a .env file in the backend directory with:");
    console.error("MONGODB_URL=mongodb://localhost:27017/your-database-name");
    console.error("Or use MongoDB Atlas connection string.");
    process.exit(1);
  }

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{console.log("DB connected successfully");})
  .catch((err)=>{
    console.log("DB connection failed!");
    console.error(err.message);
    process.exit(1);
  })
};