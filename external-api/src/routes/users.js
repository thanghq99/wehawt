const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const mockUser = {
      id: req.user.userId,
      email: 'user@example.com',
      name: 'Mock User',
      avatarUrl: 'https://example.com/avatar.jpg',
      emailVerified: true,
      organizations: [
        {
          id: 'org-123',
          name: 'Acme Corporation',
          role: 'owner',
          permissions: ['all']
        },
        {
          id: 'org-456',
          name: 'Creative Studio',
          role: 'admin',
          permissions: ['manage_content', 'manage_users']
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };
    
    res.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to fetch user profile',
      message: 'An error occurred while fetching user profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatarUrl } = req.body;
    
    const updatedUser = {
      id: req.user.userId,
      email: 'user@example.com',
      name: name || 'Updated User',
      avatarUrl: avatarUrl || null,
      emailVerified: true,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      error: 'Failed to update user profile',
      message: 'An error occurred while updating user profile'
    });
  }
});

// Get user organizations
router.get('/organizations', authenticateToken, async (req, res) => {
  try {
    const mockOrganizations = [
      {
        id: 'org-123',
        name: 'Acme Corporation',
        slug: 'acme-corp',
        role: 'owner',
        permissions: ['all'],
        joinedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'org-456',
        name: 'Creative Studio',
        slug: 'creative-studio',
        role: 'admin',
        permissions: ['manage_content', 'manage_users'],
        joinedAt: '2024-01-16T09:00:00Z'
      }
    ];
    
    res.json({
      success: true,
      organizations: mockOrganizations,
      total: mockOrganizations.length
    });
  } catch (error) {
    console.error('Get user organizations error:', error);
    res.status(500).json({
      error: 'Failed to fetch user organizations',
      message: 'An error occurred while fetching user organizations'
    });
  }
});

// Get user analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const mockAnalytics = {
      totalOrganizations: 2,
      totalPages: 15,
      totalProducts: 8,
      totalOrders: 23,
      monthlyStats: {
        pageViews: 1250,
        uniqueVisitors: 340,
        revenue: 12500,
        orders: 12
      },
      recentActivity: [
        {
          id: 'activity-1',
          type: 'page_created',
          description: 'Created new landing page',
          timestamp: '2024-01-20T14:30:00Z'
        },
        {
          id: 'activity-2',
          type: 'order_received',
          description: 'New order received for $150',
          timestamp: '2024-01-20T12:15:00Z'
        }
      ]
    };
    
    res.json({
      success: true,
      analytics: mockAnalytics
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch user analytics',
      message: 'An error occurred while fetching user analytics'
    });
  }
});

module.exports = router;
