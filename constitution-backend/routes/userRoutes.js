import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

// POST /api/users/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Basic Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password.' });
  }

  try {
    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash Password
    // Use a salt round (e.g., 10) for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user instance
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // Defaulting role to 'citizen' as requested by the schema and based on simple UI
      role: 'citizen',
    });

    // 5. Save user to database
    await newUser.save();

    // 6. Respond to client
    res.status(201).json({
        message: 'User registered successfully',
        user: {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            id: newUser._id
        }
    });

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Basic Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // 5. Respond to client
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        id: user._id,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /api/users/progress/:userId
router.get('/progress/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('progress');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const progress = {
      lessonsCompleted: user.progress.lessonsCompleted,
      quizzesCompleted: user.progress.quizzesCompleted,
      quizScores: Object.fromEntries(user.progress.quizScores)
    };
    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// PUT /api/users/progress/:userId
router.put('/progress/:userId', async (req, res) => {
  const { lessonsCompleted, quizzesCompleted, quizScores } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (lessonsCompleted !== undefined) user.progress.lessonsCompleted = lessonsCompleted;
    if (quizzesCompleted !== undefined) user.progress.quizzesCompleted = quizzesCompleted;
    if (quizScores) {
      for (const [key, value] of Object.entries(quizScores)) {
        user.progress.quizScores.set(key, value);
      }
      user.markModified('progress.quizScores');
    }

    await user.save();
    const progress = {
      lessonsCompleted: user.progress.lessonsCompleted,
      quizzesCompleted: user.progress.quizzesCompleted,
      quizScores: Object.fromEntries(user.progress.quizScores)
    };
    res.json({ message: 'Progress updated', progress });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});

export default router;

// NOTE: You must ensure your main Express server file (e.g., server.js) 
// uses this router: app.use('/api/users', require('./routes/userRoutes'));
