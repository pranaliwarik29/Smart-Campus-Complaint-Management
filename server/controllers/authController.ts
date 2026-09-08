import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../config/db';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'campuscare_dev_jwt_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

function generateToken(id: string, email: string, role: string) {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, studentId, password, confirmPassword, role } = req.body;

    if (!name || !email || !studentId || !password) {
      res.status(400).json({ success: false, message: 'All registration fields are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Passwords do not match.' });
      return;
    }

    // Check if user with same email exists
    const existingEmail = await dbService.users.findByEmail(email);
    if (existingEmail) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    // Check if studentId already exists
    const existingStudentId = await dbService.users.findByStudentId(studentId);
    if (existingStudentId) {
      res.status(400).json({ success: false, message: 'An account with this Student ID already exists.' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await dbService.users.create({
      name,
      email,
      studentId,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'student',
    });

    const token = generateToken(newUser._id, newUser.email, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        studentId: newUser.studentId,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await dbService.users.findByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. No user found with this email.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
      return;
    }

    // Role check if specific role was selected on login screen
    if (expectedRole && expectedRole !== user.role) {
      res.status(403).json({
        success: false,
        message: `Role mismatch: This account is registered as a "${user.role}", not "${expectedRole}". Please select the correct portal tab.`,
      });
      return;
    }

    const token = generateToken(user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
};
