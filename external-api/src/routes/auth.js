const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../models/database');
const { validateAuth } = require('../middleware/validation');

const router = express.Router();

// Mock authentication endpoints
router.post('/login', validateAuth, async (req, res) => {
  try {
    const { email, password, organizationId } = req.body;
    
    // Mock user authentication
    const mockUser = {
      id: 'user-123',
      email: email,
      name: 'Mock User',
      organizationId: organizationId || 'org-123',
      role: 'admin'
    };
    
    // Mock password verification (in real implementation, check against database)
    if (password !== 'password123') {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        organizationId: mockUser.organizationId,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'external-api-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        organizationId: mockUser.organizationId,
        role: mockUser.role
      },
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during authentication'
    });
  }
});

router.post('/register', validateAuth, async (req, res) => {
  try {
    const { email, password, name, organizationName } = req.body;
    
    // Mock user registration
    const mockUser = {
      id: `user-${Date.now()}`,
      email: email,
      name: name,
      organizationId: `org-${Date.now()}`,
      role: 'owner'
    };
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        organizationId: mockUser.organizationId,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'external-api-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        organizationId: mockUser.organizationId,
        role: mockUser.role
      },
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during user registration'
    });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({
        error: 'Token required',
        message: 'Refresh token is required'
      });
    }
    
    // Mock token refresh
    const mockUser = {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Mock User',
      organizationId: 'org-123',
      role: 'admin'
    };
    
    const newToken = jwt.sign(
      { 
        userId: mockUser.id, 
        organizationId: mockUser.organizationId,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'external-api-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      token: newToken,
      expiresIn: '24h'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred during token refresh'
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    // Mock logout (in real implementation, invalidate token)
    res.json({
      success: true,
      message: 'Successfully logged out'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: 'An error occurred during logout'
    });
  }
});

module.exports = router;
