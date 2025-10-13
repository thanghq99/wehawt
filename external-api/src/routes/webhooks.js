const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// Verify webhook signature
const verifyWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const webhookSecret = process.env.WEBHOOK_SECRET || 'webhook-secret';
  
  if (!signature) {
    return res.status(401).json({
      error: 'Missing signature',
      message: 'Webhook signature is required'
    });
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({
      error: 'Invalid signature',
      message: 'Webhook signature verification failed'
    });
  }
  
  next();
};

// Stripe webhook
router.post('/stripe', verifyWebhookSignature, async (req, res) => {
  try {
    const { type, data } = req.body;
    
    console.log(`Received Stripe webhook: ${type}`);
    
    // Mock webhook processing
    const webhookEvents = {
      'payment_intent.succeeded': {
        action: 'process_payment',
        orderId: data.object.id,
        amount: data.object.amount,
        currency: data.object.currency
      },
      'payment_intent.payment_failed': {
        action: 'handle_payment_failure',
        orderId: data.object.id,
        reason: data.object.last_payment_error?.message
      },
      'customer.subscription.created': {
        action: 'create_subscription',
        customerId: data.object.customer,
        subscriptionId: data.object.id
      },
      'customer.subscription.updated': {
        action: 'update_subscription',
        customerId: data.object.customer,
        subscriptionId: data.object.id,
        status: data.object.status
      },
      'customer.subscription.deleted': {
        action: 'cancel_subscription',
        customerId: data.object.customer,
        subscriptionId: data.object.id
      }
    };
    
    const event = webhookEvents[type];
    if (event) {
      console.log(`Processing webhook event: ${event.action}`, event);
      // In real implementation, process the webhook event
    }
    
    res.json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: 'An error occurred while processing the webhook'
    });
  }
});

// Domain verification webhook
router.post('/domain-verification', verifyWebhookSignature, async (req, res) => {
  try {
    const { domain, organizationId, status, sslCertificate } = req.body;
    
    console.log(`Domain verification webhook for ${domain}: ${status}`);
    
    // Mock domain verification processing
    const verificationResult = {
      domain: domain,
      organizationId: organizationId,
      status: status,
      sslCertificate: sslCertificate,
      verifiedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      result: verificationResult,
      message: 'Domain verification processed successfully'
    });
  } catch (error) {
    console.error('Domain verification webhook error:', error);
    res.status(500).json({
      error: 'Domain verification failed',
      message: 'An error occurred while processing domain verification'
    });
  }
});

// Custom webhook endpoint
router.post('/custom/:eventType', verifyWebhookSignature, async (req, res) => {
  try {
    const { eventType } = req.params;
    const payload = req.body;
    
    console.log(`Custom webhook received: ${eventType}`, payload);
    
    // Mock custom webhook processing
    const customEvents = {
      'user_registered': {
        action: 'send_welcome_email',
        userId: payload.userId,
        email: payload.email
      },
      'organization_created': {
        action: 'setup_organization',
        organizationId: payload.organizationId,
        name: payload.name
      },
      'page_published': {
        action: 'notify_team',
        pageId: payload.pageId,
        organizationId: payload.organizationId
      },
      'order_created': {
        action: 'send_order_confirmation',
        orderId: payload.orderId,
        customerEmail: payload.customerEmail
      }
    };
    
    const event = customEvents[eventType];
    if (event) {
      console.log(`Processing custom event: ${event.action}`, event);
      // In real implementation, process the custom webhook event
    }
    
    res.json({
      success: true,
      eventType: eventType,
      message: 'Custom webhook processed successfully'
    });
  } catch (error) {
    console.error('Custom webhook error:', error);
    res.status(500).json({
      error: 'Custom webhook processing failed',
      message: 'An error occurred while processing the custom webhook'
    });
  }
});

module.exports = router;
