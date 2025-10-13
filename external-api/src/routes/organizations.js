const express = require('express');
const { query } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all organizations (mock data)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const mockOrganizations = [
      {
        id: 'org-123',
        name: 'Acme Corporation',
        slug: 'acme-corp',
        description: 'Leading technology company',
        logoUrl: 'https://example.com/logo.png',
        websiteUrl: 'https://acme.com',
        customDomain: 'acme.com',
        sslVerified: true,
        settings: {
          theme: 'modern',
          features: ['ecommerce', 'blog', 'analytics']
        },
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'org-456',
        name: 'Creative Studio',
        slug: 'creative-studio',
        description: 'Digital creative agency',
        logoUrl: 'https://example.com/creative-logo.png',
        websiteUrl: 'https://creative-studio.com',
        customDomain: 'creative-studio.com',
        sslVerified: true,
        settings: {
          theme: 'creative',
          features: ['portfolio', 'blog', 'contact']
        },
        createdAt: '2024-01-20T14:30:00Z',
        updatedAt: '2024-01-20T14:30:00Z'
      }
    ];
    
    res.json({
      success: true,
      organizations: mockOrganizations,
      total: mockOrganizations.length
    });
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      error: 'Failed to fetch organizations',
      message: 'An error occurred while fetching organizations'
    });
  }
});

// Get organization by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock organization data
    const mockOrganization = {
      id: id,
      name: 'Acme Corporation',
      slug: 'acme-corp',
      description: 'Leading technology company',
      logoUrl: 'https://example.com/logo.png',
      websiteUrl: 'https://acme.com',
      customDomain: 'acme.com',
      sslVerified: true,
      settings: {
        theme: 'modern',
        features: ['ecommerce', 'blog', 'analytics']
      },
      members: [
        {
          id: 'member-1',
          userId: 'user-123',
          role: 'owner',
          permissions: ['all'],
          joinedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 'member-2',
          userId: 'user-456',
          role: 'admin',
          permissions: ['manage_content', 'manage_users'],
          joinedAt: '2024-01-16T09:00:00Z'
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };
    
    res.json({
      success: true,
      organization: mockOrganization
    });
  } catch (error) {
    console.error('Get organization error:', error);
    res.status(500).json({
      error: 'Failed to fetch organization',
      message: 'An error occurred while fetching the organization'
    });
  }
});

// Create new organization
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, websiteUrl } = req.body;
    
    // Mock organization creation
    const newOrganization = {
      id: `org-${Date.now()}`,
      name: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      logoUrl: null,
      websiteUrl: websiteUrl || null,
      customDomain: null,
      sslVerified: false,
      settings: {
        theme: 'default',
        features: ['blog']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.status(201).json({
      success: true,
      organization: newOrganization,
      message: 'Organization created successfully'
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      error: 'Failed to create organization',
      message: 'An error occurred while creating the organization'
    });
  }
});

// Update organization
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, websiteUrl, settings } = req.body;
    
    // Mock organization update
    const updatedOrganization = {
      id: id,
      name: name || 'Updated Organization',
      slug: name ? name.toLowerCase().replace(/\s+/g, '-') : 'updated-org',
      description: description || 'Updated description',
      websiteUrl: websiteUrl || null,
      settings: settings || { theme: 'default' },
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      organization: updatedOrganization,
      message: 'Organization updated successfully'
    });
  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({
      error: 'Failed to update organization',
      message: 'An error occurred while updating the organization'
    });
  }
});

// Delete organization
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock organization deletion
    res.json({
      success: true,
      message: 'Organization deleted successfully'
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({
      error: 'Failed to delete organization',
      message: 'An error occurred while deleting the organization'
    });
  }
});

module.exports = router;
