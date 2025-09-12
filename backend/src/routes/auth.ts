import express from 'express';

const router = express.Router();

// Mock authentication routes for prototype

// Student login
router.post('/login', (req, res) => {
  // Mock response - replace with actual authentication logic
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: 1,
      username: 'student123',
      email: 'student@university.edu',
      institutionId: 'UNIV123',
      role: 'student',
      profile: {
        name: 'Kabir Kumar ',
        year: 3,
        department: 'Computer Science'
      }
    }
  });
});

// Student registration
router.post('/register', (req, res) => {
  // Mock response - replace with actual registration logic
  res.json({
    success: true,
    message: 'Registration successful',
    user: {
      id: 2,
      username: req.body.username,
      email: req.body.email,
      institutionId: req.body.institutionId,
      role: 'student'
    }
  });
});

// Counselor login
router.post('/counselor/login', (req, res) => {
  // Mock response - replace with actual authentication logic
  res.json({
    success: true,
    message: 'Counselor login successful',
    token: 'mock-counselor-jwt-token',
    user: {
      id: 101,
      username: 'counselor1',
      email: 'counselor@university.edu',
      role: 'counselor',
      profile: {
        name: 'Dr. Aasha Akhtar',
        specialization: 'Clinical Psychology',
        experience: 8
      }
    }
  });
});

// Admin login
router.post('/admin/login', (req, res) => {
  // Mock response - replace with actual authentication logic
  res.json({
    success: true,
    message: 'Admin login successful',
    token: 'mock-admin-jwt-token',
    user: {
      id: 201,
      username: 'admin1',
      email: 'admin@university.edu',
      role: 'admin',
      profile: {
        name: 'Admin User',
        institution: 'University Mental Health Center'
      }
    }
  });
});

// Logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Token verification
router.get('/verify', (req, res) => {
  // Mock token verification - replace with actual JWT verification
  res.json({
    success: true,
    valid: true,
    user: {
      id: 1,
      username: 'student123',
      role: 'student'
    }
  });
});

export default router;