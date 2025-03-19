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
    const { name, type, price } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = new Product({ name, type, price, image: imagePath });
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
    const { name, type, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, type, price, image },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

export default router;
