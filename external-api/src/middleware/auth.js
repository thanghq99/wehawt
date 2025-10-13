const jwt = require('jsonwebtoken');

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Authorization header with Bearer token is required'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'external-api-secret');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Access token has expired'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Access token is invalid'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Token verification failed'
      });
    }
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }
    
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Required role: ${roles.join(' or ')}, current role: ${userRole}`
      });
    }
    
    next();
  };
};

// Check if user has required permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated'
      });
    }
    
    const userPermissions = req.user.permissions || [];
    if (!userPermissions.includes(permission) && !userPermissions.includes('all')) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Required permission: ${permission}`
      });
    }
    
    next();
  };
};

// Check organization access
const requireOrganizationAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'User must be authenticated'
    });
  }
  
  const organizationId = req.params.orgId || req.params.id;
  const userOrganizationId = req.user.organizationId;
  
  if (organizationId && userOrganizationId !== organizationId) {
    return res.status(403).json({
      error: 'Access denied',
      message: 'User does not have access to this organization'
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requirePermission,
  requireOrganizationAccess
};
