const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./config/db");
const cloudinary = require("cloudinary").v2; //  ADD
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const agreementRoutes = require("./routes/agreementRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");

connectDB();

//  Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://borrvio.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/agreements", agreementRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

app.use("/agreements", express.static(path.join(__dirname, "agreements")));

app.get("/", (req, res) => {
  res.send("Borrvio API is running...");
});

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
