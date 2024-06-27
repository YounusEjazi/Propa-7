require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files statically

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

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
  profilePicture: String,
});

const User = mongoose.model("User", userSchema);

// Exercise Schema
const exerciseSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: String,
  description: String,
  img: String,
  details: String, // New field for additional details
  date: { type: Date, default: Date.now },
  createdBy: String
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

// Material Schema
const materialSchema = new mongoose.Schema({
  title: String,
  link: String,
  filePath: String, // New field for file path
  exerciseId: { type: String, ref: 'Exercise' }, // Use string type to match `id` field in Exercise
});

const Material = mongoose.model("Material", materialSchema);

// Feedback Schema
const feedbackSchema = new mongoose.Schema(
  {
    feedbackUserId: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
    feedback: String,
    comments: [
      {
        firstName: String,
        lastName: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

// PredefinedArea Schema
const predefinedAreaSchema = new mongoose.Schema({
  exerciseId: { type: String, ref: 'Exercise' },
  elementId: Number,
  startX: Number,
  startY: Number,
  endX: Number,
  endY: Number,
  isCorrect: Boolean, // New field to store the correctness
});

const PredefinedArea = mongoose.model("PredefinedArea", predefinedAreaSchema);

// Middleware for verifying token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token is required");
  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY); // Split the Bearer token
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

// Set up multer for storing uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post('/upload-profile-picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });

    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ status: 'ok', data: user });
  } catch (err) {
    res.status(500).send(err);
  }
});

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

    const token = jwt.sign({ id: user._id, email: user.email, fname: user.fname, lname: user.lname, userType: user.userType }, SECRET_KEY, {
      expiresIn: "1h",
    });

    const userData = {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      userType: user.userType,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ status: "ok", data: { token, user: userData } });
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
    const user = await User.findByIdAndDelete(userid);
    if (!user) {
      return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "ok", message: "User deleted successfully" });
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

app.post("/update-user", verifyToken, async (req, res) => {
  const { fname, lname, email } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    user.fname = fname;
    user.lname = lname;
    user.email = email;

    await user.save();
    res.status(200).json({ status: "ok", data: user });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Exercise routes
app.post('/add-exercise', verifyToken, async (req, res) => {
  if (req.user.userType !== 'Admin') {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const { id, title, description, img } = req.body;
  const date = new Date().toISOString();
  const createdBy = `${req.user.fname} ${req.user.lname}`; // Get admin's name

  const newExercise = new Exercise({ id, title, description, img, date, createdBy });

  try {
    await newExercise.save();
    res.status(200).json({ status: 'ok', message: 'Exercise added successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/get-exercises', verifyToken, async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json({ status: 'ok', data: exercises });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Existing endpoint to fetch a single exercise
app.get('/get-exercise/:id', verifyToken, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({ id: req.params.id });
    if (!exercise) {
      return res.status(404).json({ status: 'error', message: 'Exercise not found' });
    }
    res.status(200).json({ status: 'ok', data: exercise });
  } catch (err) {
    res.status(500).send(err);
  }
});


// delete exercise
app.delete('/delete-exercise/:id', verifyToken, async (req, res) => {
  if (req.user.userType !== 'Admin') {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  try {
    const exercise = await Exercise.findOneAndDelete({ id: req.params.id });
    if (!exercise) {
      return res.status(404).json({ status: 'error', message: 'Exercise not found' });
    }
    res.status(200).json({ status: 'ok', message: 'Exercise deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});


// Endpoint to update exercise details
app.post('/update-exercise/:id', verifyToken, async (req, res) => {
  if (req.user.userType !== 'Admin') {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  try {
    const exercise = await Exercise.findOne({ id: req.params.id });
    if (!exercise) {
      return res.status(404).json({ status: 'error', message: 'Exercise not found' });
    }

    exercise.details = req.body.details;
    await exercise.save();
    
    res.status(200).json({ status: 'ok', message: 'Exercise details updated successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});


// Add supportive material (Admin only)
app.post('/add-materials', verifyToken, upload.single('file'), async (req, res) => {
  if (req.user.userType !== 'Admin') {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const { title, link, exerciseId } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  // Validate that the exerciseId exists in the Exercise collection
  const exercise = await Exercise.findOne({ id: exerciseId });
  if (!exercise) {
    return res.status(400).json({ status: 'error', message: 'Invalid exercise ID' });
  }

  const newMaterial = new Material({ title, link, filePath, exerciseId });

  try {
    await newMaterial.save();
    res.status(201).json({ status: 'ok', message: 'Material added successfully', data: newMaterial });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get materials by exercise ID
app.get('/get-materials', verifyToken, async (req, res) => {
  try {
    const materials = await Material.find();
    res.status(200).json({ status: 'ok', data: materials });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get materials by exercise ID
app.get('/get-materials/:exerciseId', verifyToken, async (req, res) => {
  try {
    const materials = await Material.find({ exerciseId: req.params.exerciseId });
    res.status(200).json({ status: 'ok', data: materials });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete supportive material
app.delete('/delete-material', verifyToken, async (req, res) => {
  try {
    await Material.deleteOne({ _id: req.body.id });
    res.status(200).json({ status: 'ok', data: true });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Feedback
app.post("/add-feedback", verifyToken, async (req, res) => {
  const { feedbackUserId, firstName, lastName, feedback } = req.body;

  const newFeedback = new Feedback({ feedbackUserId: new mongoose.Types.ObjectId(feedbackUserId), firstName, lastName, feedback });

  try {
    await newFeedback.save();
    res
      .status(200)
      .json({ status: "ok", message: "Feedback added successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all feedback
app.get("/get-feedback", verifyToken, async (req, res) => {
  try {
    const allFeedback = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "ok", data: allFeedback });
  } catch (err) {
    res.status(500).send(err);
  }
});

//Delete feedback
app.post('/delete-feedback', async (req, res) => {
  const { id } = req.body;
  try {
    await Feedback.findByIdAndDelete(id); // Assuming you are using Mongoose
    res.json({ status: 'ok' });
  } catch (error) {
    res.json({ status: 'error', error: 'Failed to delete feedback' });
  }
});

// Get comments for a feedback
app.get("/get-comments/:id", verifyToken, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ status: "error", message: "Feedback not found" });
    }
    res.status(200).json({ status: "ok", data: feedback.comments });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Add comment to feedback
app.post("/add-comment/:id", verifyToken, async (req, res) => {
  const { firstName, lastName, comment } = req.body;

  console.log("comment is ", comment);
  console.log("id is ", req.params.id);

  try {
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comments: {
            firstName,
            lastName,
            comment,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      status: "ok",
      message: "Comment added successfully",
      updatedFeedback,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// New Endpoint to Fetch All Comments
app.get("/get-all-comments", verifyToken, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({}, { comments: 1, _id: 0 });
    const allComments = feedbacks.reduce((acc, feedback) => {
      acc = acc.concat(feedback.comments);
      return acc;
    }, []);
    res.status(200).json({ status: "ok", data: allComments });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Add predefined area
app.post('/add-predefined-area', verifyToken, async (req, res) => {
  if (req.user.userType !== 'Admin') {
    return res.status(403).json({ status: 'error', message: 'Access denied' });
  }

  const { exerciseId, elementId, startX, startY, endX, endY } = req.body;

  const newArea = new PredefinedArea({ exerciseId, elementId, startX, startY, endX, endY, isCorrect: false });

  try {
    await newArea.save();
    res.status(200).json({ status: 'ok', message: 'Predefined area added successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get predefined areas for an exercise
app.get('/get-predefined-areas/:exerciseId', verifyToken, async (req, res) => {
  try {
    const areas = await PredefinedArea.find({ exerciseId: req.params.exerciseId });
    res.status(200).json({ status: 'ok', data: areas });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
