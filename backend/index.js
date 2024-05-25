const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "your_secret_key"; // Replace with your own secret key
const ADMIN_SECRET_KEY = "Tragkonstruktion"; // Admin secret key

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/yourDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to the database");
});

// User Schema
const userSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true },
  password: String,
  userType: String,
});

const User = mongoose.model("User", userSchema);

// Middleware for verifying token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token is required");
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

// Routes
app.post("/sign-up", async (req, res) => {
  const { fname, lname, email, password, userType, secretKey } = req.body;

  if (userType === "Admin" && secretKey !== ADMIN_SECRET_KEY) {
    return res.status(403).json({ status: "error", message: "Invalid Admin Secret Key" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fname, lname, email, password: hashedPassword, userType });

    await newUser.save();
    res.status(200).json({ status: "ok", message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ status: "error", message: "Email already exists" });
    }
    res.status(500).send(err);
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ status: "error", message: "Invalid password" });

    const token = jwt.sign({ id: user._id, email: user.email, userType: user.userType }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ status: "ok", data: token });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/getAllUser", verifyToken, async (req, res) => {
  const searchQuery = req.query.search || "";
  try {
    const users = await User.find({ fname: { $regex: searchQuery, $options: "i" } });
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/deleteUser", verifyToken, async (req, res) => {
  const { userid } = req.body;
  try {
    await User.findByIdAndRemove(userid);
    res.status(200).json({ data: "User deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/userData", verifyToken, async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ status: "error", data: "User not found" });
    res.status(200).json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
