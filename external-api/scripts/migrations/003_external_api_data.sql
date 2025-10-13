-- Seed data for external API development and testing

-- Insert sample organizations
INSERT INTO external_api_organizations (id, name, slug, description, api_domain, webhook_url, webhook_secret, rate_limit_per_hour, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Acme Corporation', 'acme-corp', 'Leading technology company', 'api.acme.com', 'https://api.acme.com/webhooks', 'webhook-secret-123', 5000, '{"theme": "modern", "features": ["analytics", "webhooks"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'Creative Studio', 'creative-studio', 'Digital creative agency', 'api.creative-studio.com', 'https://api.creative-studio.com/webhooks', 'webhook-secret-456', 2000, '{"theme": "creative", "features": ["portfolio", "analytics"]}'),
('550e8400-e29b-41d4-a716-446655440003', 'Tech Startup', 'tech-startup', 'Innovative technology startup', 'api.techstartup.com', 'https://api.techstartup.com/webhooks', 'webhook-secret-789', 1000, '{"theme": "minimal", "features": ["analytics"]}');

-- Insert sample API users
INSERT INTO external_api_users (id, email, name, api_key, organization_id, role, permissions, is_active) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'admin@acme.com', 'Acme Admin', 'ak_live_1234567890abcdef', '550e8400-e29b-41d4-a716-446655440001', 'admin', '["all"]', true),
('660e8400-e29b-41d4-a716-446655440002', 'dev@acme.com', 'Acme Developer', 'ak_live_abcdef1234567890', '550e8400-e29b-41d4-a716-446655440001', 'developer', '["read", "write", "analytics"]', true),
('660e8400-e29b-41d4-a716-446655440003', 'viewer@creative-studio.com', 'Creative Viewer', 'ak_live_9876543210fedcba', '550e8400-e29b-41d4-a716-446655440002', 'viewer', '["read"]', true),
('660e8400-e29b-41d4-a716-446655440004', 'admin@techstartup.com', 'Startup Admin', 'ak_live_fedcba0987654321', '550e8400-e29b-41d4-a716-446655440003', 'admin', '["all"]', true);

-- Insert sample webhooks
INSERT INTO external_api_webhooks (organization_id, webhook_type, webhook_url, secret, events, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'stripe', 'https://api.acme.com/webhooks/stripe', 'whsec_stripe_123', '["payment_intent.succeeded", "payment_intent.payment_failed"]', true),
('550e8400-e29b-41d4-a716-446655440001', 'domain_verification', 'https://api.acme.com/webhooks/domain', 'whsec_domain_123', '["domain.verified", "domain.failed"]', true),
('550e8400-e29b-41d4-a716-446655440002', 'analytics', 'https://api.creative-studio.com/webhooks/analytics', 'whsec_analytics_456', '["page_view", "conversion"]', true);

-- Insert sample analytics data
INSERT INTO external_api_analytics (organization_id, metric_name, metric_value, metric_unit, dimensions, timestamp) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'api_requests', 15000, 'count', '{"endpoint": "/api/analytics", "method": "GET"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', 'api_requests', 12000, 'count', '{"endpoint": "/api/organizations", "method": "GET"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', 'api_requests', 8000, 'count', '{"endpoint": "/api/users", "method": "GET"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'api_requests', 5000, 'count', '{"endpoint": "/api/analytics", "method": "GET"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440002', 'api_requests', 3000, 'count', '{"endpoint": "/api/organizations", "method": "GET"}', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 'api_requests', 2000, 'count', '{"endpoint": "/api/analytics", "method": "GET"}', NOW() - INTERVAL '1 day');

-- Insert sample events
INSERT INTO external_api_events (organization_id, user_id, event_type, event_data, endpoint, method, status_code, response_time_ms, ip_address, user_agent) VALUES
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'api_request', '{"endpoint": "/api/analytics", "method": "GET"}', '/api/analytics', 'GET', 200, 150, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', 'api_request', '{"endpoint": "/api/organizations", "method": "GET"}', '/api/organizations', 'GET', 200, 200, '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', 'api_request', '{"endpoint": "/api/users", "method": "GET"}', '/api/users', 'GET', 200, 180, '192.168.1.102', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36');
