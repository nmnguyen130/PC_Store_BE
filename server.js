import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
