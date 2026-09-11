require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Order = require("./models/Order");

const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/coresupplements";
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HelLO World !");
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { email, items, total, reference } = req.body;

    if (!email || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
      return res.status(400).json({ message: "email, items and total are required." });
    }

    const order = await Order.create({ email, items, total, reference });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running on port :", PORT);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });