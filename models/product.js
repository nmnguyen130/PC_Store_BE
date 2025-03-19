import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
