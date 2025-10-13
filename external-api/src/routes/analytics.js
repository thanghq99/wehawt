const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get organization analytics
router.get('/organization/:orgId', authenticateToken, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { period = '30d', metric = 'all' } = req.query;
    
    const mockAnalytics = {
      organizationId: orgId,
      period: period,
      overview: {
        totalPageViews: 12500,
        uniqueVisitors: 3400,
        bounceRate: 0.35,
        avgSessionDuration: '2m 45s',
        conversionRate: 0.08
      },
      traffic: {
        sources: [
          { source: 'Direct', visitors: 1200, percentage: 35.3 },
          { source: 'Google', visitors: 980, percentage: 28.8 },
          { source: 'Social Media', visitors: 650, percentage: 19.1 },
          { source: 'Referral', visitors: 570, percentage: 16.8 }
        ],
        devices: [
          { device: 'Desktop', visitors: 1800, percentage: 52.9 },
          { device: 'Mobile', visitors: 1200, percentage: 35.3 },
          { device: 'Tablet', visitors: 400, percentage: 11.8 }
        ],
        countries: [
          { country: 'United States', visitors: 1200, percentage: 35.3 },
          { country: 'Canada', visitors: 800, percentage: 23.5 },
          { country: 'United Kingdom', visitors: 600, percentage: 17.6 },
          { country: 'Germany', visitors: 400, percentage: 11.8 },
          { country: 'Other', visitors: 400, percentage: 11.8 }
        ]
      },
      content: {
        topPages: [
          { page: '/', views: 2500, uniqueViews: 1200 },
          { page: '/about', views: 1800, uniqueViews: 900 },
          { page: '/products', views: 1500, uniqueViews: 750 },
          { page: '/contact', views: 1200, uniqueViews: 600 }
        ],
        topProducts: [
          { product: 'Premium Plan', views: 800, orders: 45 },
          { product: 'Basic Plan', views: 600, orders: 32 },
          { product: 'Enterprise Plan', views: 400, orders: 18 }
        ]
      },
      ecommerce: {
        revenue: {
          total: 125000,
          currency: 'USD',
          period: period,
          growth: 0.15
        },
        orders: {
          total: 156,
          averageOrderValue: 801.28,
          conversionRate: 0.08
        },
        products: [
          { name: 'Premium Plan', revenue: 45000, orders: 45 },
          { name: 'Basic Plan', revenue: 32000, orders: 32 },
          { name: 'Enterprise Plan', revenue: 48000, orders: 18 }
        ]
      },
      timeline: [
        { date: '2024-01-01', pageViews: 400, uniqueVisitors: 120, revenue: 1200 },
        { date: '2024-01-02', pageViews: 450, uniqueVisitors: 135, revenue: 1500 },
        { date: '2024-01-03', pageViews: 380, uniqueVisitors: 110, revenue: 900 },
        { date: '2024-01-04', pageViews: 520, uniqueVisitors: 155, revenue: 1800 },
        { date: '2024-01-05', pageViews: 480, uniqueVisitors: 140, revenue: 1600 }
      ]
    };
    
    res.json({
      success: true,
      analytics: mockAnalytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'An error occurred while fetching analytics'
    });
  }
});

// Get page analytics
router.get('/pages/:pageId', authenticateToken, async (req, res) => {
  try {
    const { pageId } = req.params;
    const { period = '30d' } = req.query;
    
    const mockPageAnalytics = {
      pageId: pageId,
      period: period,
      metrics: {
        pageViews: 2500,
        uniqueViews: 1200,
        avgTimeOnPage: '3m 15s',
        bounceRate: 0.25,
        exitRate: 0.15
      },
      traffic: {
        sources: [
          { source: 'Direct', views: 800, percentage: 32.0 },
          { source: 'Google', views: 700, percentage: 28.0 },
          { source: 'Social Media', views: 500, percentage: 20.0 },
          { source: 'Referral', views: 500, percentage: 20.0 }
        ],
        devices: [
          { device: 'Desktop', views: 1300, percentage: 52.0 },
          { device: 'Mobile', views: 900, percentage: 36.0 },
          { device: 'Tablet', views: 300, percentage: 12.0 }
        ]
      },
      timeline: [
        { date: '2024-01-01', views: 80, uniqueViews: 40 },
        { date: '2024-01-02', views: 90, uniqueViews: 45 },
        { date: '2024-01-03', views: 75, uniqueViews: 38 },
        { date: '2024-01-04', views: 100, uniqueViews: 50 },
        { date: '2024-01-05', views: 95, uniqueViews: 48 }
      ]
    };
    
    res.json({
      success: true,
      analytics: mockPageAnalytics
    });
  } catch (error) {
    console.error('Get page analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch page analytics',
      message: 'An error occurred while fetching page analytics'
    });
  }
});

// Track page view
router.post('/track', async (req, res) => {
  try {
    const { pageId, organizationId, eventType = 'page_view', eventData = {} } = req.body;
    
    // Mock tracking (in real implementation, store in database)
    const trackingData = {
      id: `track-${Date.now()}`,
      pageId: pageId,
      organizationId: organizationId,
      eventType: eventType,
      eventData: eventData,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      referrer: req.headers.referer,
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      trackingId: trackingData.id,
      message: 'Event tracked successfully'
    });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({
      error: 'Failed to track event',
      message: 'An error occurred while tracking the event'
    });
  }
});

module.exports = router;
