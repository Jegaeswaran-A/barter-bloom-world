
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "swapspace-secret-key";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/swapspace", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Invalid file type. Only JPEG and PNG are allowed.");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }
    cb(null, true);
  },
});

// Schema definitions
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  bio: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lookingFor: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Models
const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: "Please authenticate" });
  }
};

// API Routes

// User registration
app.post("/api/users/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User login
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    
    res.json({
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          bio: user.bio,
          location: user.location,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user
app.get("/api/users/me", auth, async (req, res) => {
  try {
    res.json({
      message: "Current user retrieved",
      data: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        bio: req.user.bio,
        location: req.user.location,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
app.put("/api/users/me", auth, async (req, res) => {
  try {
    const { name, bio, location } = req.body;
    
    const user = req.user;
    
    // Update fields
    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    
    await user.save();
    
    res.json({
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload image
app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: "Image uploaded successfully",
      data: {
        url: imageUrl,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new item
app.post("/api/items", auth, async (req, res) => {
  try {
    const { title, description, images, category, condition, lookingFor, location } = req.body;
    
    const item = new Item({
      title,
      description,
      images,
      category,
      condition,
      owner: req.user._id,
      lookingFor,
      location,
    });
    
    await item.save();
    
    // Populate owner details
    await item.populate("owner", "name");
    
    res.status(201).json({
      message: "Item created successfully",
      data: item,
    });
  } catch (error) {
    console.error("Create item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all items (with optional filtering)
app.get("/api/items", async (req, res) => {
  try {
    const { category, condition, search, limit = 20, page = 1 } = req.query;
    
    const filter = {};
    
    // Apply filters if provided
    if (category) filter.category = category;
    if (condition) filter.condition = condition;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("owner", "name");
    
    res.json({
      message: "Items retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error("Get items error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single item
app.get("/api/items/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("owner", "name");
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json({
      message: "Item retrieved successfully",
      data: item,
    });
  } catch (error) {
    console.error("Get item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update item
app.put("/api/items/:id", auth, async (req, res) => {
  try {
    const { title, description, images, category, condition, lookingFor, location } = req.body;
    
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Check ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }
    
    // Update fields
    item.title = title || item.title;
    item.description = description || item.description;
    item.images = images || item.images;
    item.category = category || item.category;
    item.condition = condition || item.condition;
    item.lookingFor = lookingFor || item.lookingFor;
    item.location = location || item.location;
    item.updatedAt = Date.now();
    
    await item.save();
    
    // Populate owner details
    await item.populate("owner", "name");
    
    res.json({
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete item
app.delete("/api/items/:id", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    // Check ownership
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }
    
    await item.deleteOne();
    
    res.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user items
app.get("/api/users/:id/items", async (req, res) => {
  try {
    const items = await Item.find({ owner: req.params.id })
      .sort({ createdAt: -1 })
      .populate("owner", "name");
    
    res.json({
      message: "User items retrieved successfully",
      data: items,
    });
  } catch (error) {
    console.error("Get user items error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add the following dependencies
// npm install express mongoose cors multer bcryptjs jsonwebtoken

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
