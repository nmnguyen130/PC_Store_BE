import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/product.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create a new product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { id, type, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({ id, type, price, image: imagePath });
    await newProduct.save();

    res.status(201).json({ message: "Product created!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { type, price, image },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

export default router;
