const Joi = require('joi');

// Validation schemas
const schemas = {
  auth: {
    login: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      organizationId: Joi.string().optional()
    }),
    register: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().min(2).max(100).required(),
      organizationName: Joi.string().min(2).max(100).optional()
    })
  },
  organization: {
    create: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      description: Joi.string().max(500).optional(),
      websiteUrl: Joi.string().uri().optional()
    }),
    update: Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      description: Joi.string().max(500).optional(),
      websiteUrl: Joi.string().uri().optional(),
      settings: Joi.object().optional()
    })
  },
  user: {
    updateProfile: Joi.object({
      name: Joi.string().min(2).max(100).optional(),
      avatarUrl: Joi.string().uri().optional()
    })
  },
  analytics: {
    track: Joi.object({
      pageId: Joi.string().required(),
      organizationId: Joi.string().required(),
      eventType: Joi.string().valid('page_view', 'click', 'conversion', 'custom').optional(),
      eventData: Joi.object().optional()
    })
  }
};

// Generic validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));
      
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Request validation failed',
        details: errorDetails
      });
    }
    
    req[property] = value;
    next();
  };
};

// Specific validation middleware
const validateAuth = (req, res, next) => {
  const endpoint = req.path.includes('login') ? 'login' : 'register';
  return validate(schemas.auth[endpoint])(req, res, next);
};

const validateOrganization = (req, res, next) => {
  const endpoint = req.method === 'POST' ? 'create' : 'update';
  return validate(schemas.organization[endpoint])(req, res, next);
};

const validateUser = (req, res, next) => {
  return validate(schemas.user.updateProfile)(req, res, next);
};

const validateAnalytics = (req, res, next) => {
  return validate(schemas.analytics.track)(req, res, next);
};

module.exports = {
  validate,
  validateAuth,
  validateOrganization,
  validateUser,
  validateAnalytics,
  schemas
};
