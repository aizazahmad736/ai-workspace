import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ai_workspace_secret_key_123';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Admin', // Default registered user is admin of their space
      plan: 'Free',
      aiUsageLimit: 20,
      aiUsageCount: 0
    });

    if (user) {
      await Activity.create({
        userId: user.id || user._id,
        userName: user.name,
        action: 'Account Created',
        details: 'Registered a new account on AI Workspace'
      });

      res.status(201).json({
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        aiUsageLimit: user.aiUsageLimit,
        aiUsageCount: user.aiUsageCount,
        token: generateToken(user.id || user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      await Activity.create({
        userId: user.id || user._id,
        userName: user.name,
        action: 'User Login',
        details: 'Successfully logged in to the dashboard'
      });

      res.json({
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        aiUsageLimit: user.aiUsageLimit,
        aiUsageCount: user.aiUsageCount,
        token: generateToken(user.id || user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    id: req.user.id || req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    plan: req.user.plan,
    aiUsageLimit: req.user.aiUsageLimit,
    aiUsageCount: req.user.aiUsageCount
  });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user.id || req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id || req.user._id, {
      name: user.name,
      password: user.password
    });

    await Activity.create({
      userId: user.id || user._id,
      userName: user.name,
      action: 'Profile Updated',
      details: 'Updated profile settings'
    });

    res.json({
      id: updatedUser.id || updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      plan: updatedUser.plan,
      aiUsageLimit: updatedUser.aiUsageLimit,
      aiUsageCount: updatedUser.aiUsageCount
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const updatePlan = async (req, res) => {
  const { plan } = req.body;
  const user = await User.findById(req.user.id || req.user._id);

  if (user) {
    let limit = 20;
    if (plan === 'Pro') limit = 100;
    if (plan === 'Enterprise') limit = 9999;

    await User.findByIdAndUpdate(req.user.id || req.user._id, {
      plan,
      aiUsageLimit: limit
    });

    await Activity.create({
      userId: user.id || user._id,
      userName: user.name,
      action: 'Plan Upgraded',
      details: `Changed plan subscription to ${plan}`
    });

    res.json({
      message: 'Plan updated successfully',
      plan,
      aiUsageLimit: limit
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
