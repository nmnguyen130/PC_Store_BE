import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS to allow requests from different origins
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Connect to MongoDB database
connectDB();

// Mount routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
