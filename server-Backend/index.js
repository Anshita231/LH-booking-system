require("dotenv").config();
const express = require("express");
const bcrypt=require("bcrypt")
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const gsecRoutes = require("./routes/gsecRoutes");
const assistantRegistrarRoutes = require("./routes/assistantRegistrarRoutes");
const guardRoutes = require("./routes/guardRoutes");
const facultyMentorRoutes = require("./routes/facultyMentorRoutes");
const systemAdministratorRoutes = require("./routes/systemAdministratorRoutes");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");
const { connectDB } = require("./config/database");
const expressSession = require("express-session");
var cors = require("cors");
const cron = require("node-cron");
const Booking = require("./models/Booking");
//middlewares

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',') 
      : ["https://lh-booking-system-frontend.vercel.app/"],
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production', // true in production (HTTPS), false in development
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      httpOnly: true,
    },
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

connectDB();
app.use("/auth", authRoutes);
app.use("/facultyMentor", facultyMentorRoutes);
app.use("/gsec", gsecRoutes);
app.use("/guard", guardRoutes);
app.use("/systemAdministrator", systemAdministratorRoutes);
app.use("/assistantRegistrar", assistantRegistrarRoutes);

app.get("/api/user", verifyToken, (req, res) => {
  const userData = req.user;
  res.status(200).json({ user: userData });
});
app.get("/deleteUnwanted", async (req, res) => {
  const currentDate = new Date().toISOString();
  console.log("inside schedular", new Date());
  try {
    const result = await Booking.deleteMany({ endDate: { $lt: currentDate } });
    console.log(`${result?.deletedCount} bookings deleted`);
    if (result.deletedCount === 0) {
      console.log("No bookings found to delete.");
      return res.status(200).json({ message: "No bookings found to delete." });
    }

    console.log(`${result.deletedCount} bookings deleted`);
    return res
      .status(200)
      .json({ message: `${result.deletedCount} bookings deleted` });
  } catch (err) {
    console.error("Error occurred while deleting bookings:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
cron.schedule("22 21 * * *", async () => {
  const currentDate = new Date().toISOString();
  console.log("inside schedular");
  try {
    const result = await Booking.deleteMany({ endDate: { $lt: currentDate } });
    console.log(`${result.deletedCount} bookings deleted`);
  } catch (err) {
    console.error("Error occurred while deleting bookings:", err);
  }
});

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}!`);
});


