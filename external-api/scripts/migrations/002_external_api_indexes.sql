-- Performance indexes for external API tables

-- External API users indexes
CREATE INDEX idx_external_api_users_email ON external_api_users(email);
CREATE INDEX idx_external_api_users_api_key ON external_api_users(api_key);
CREATE INDEX idx_external_api_users_organization ON external_api_users(organization_id);
CREATE INDEX idx_external_api_users_active ON external_api_users(is_active);

-- External API organizations indexes
CREATE INDEX idx_external_api_organizations_slug ON external_api_organizations(slug);
CREATE INDEX idx_external_api_organizations_domain ON external_api_organizations(api_domain);
CREATE INDEX idx_external_api_organizations_active ON external_api_organizations(is_active);

-- External API sessions indexes
CREATE INDEX idx_external_api_sessions_user ON external_api_sessions(user_id);
CREATE INDEX idx_external_api_sessions_organization ON external_api_sessions(organization_id);
CREATE INDEX idx_external_api_sessions_token ON external_api_sessions(session_token);
CREATE INDEX idx_external_api_sessions_expires ON external_api_sessions(expires_at);

-- External API events indexes
CREATE INDEX idx_external_api_events_organization ON external_api_events(organization_id);
CREATE INDEX idx_external_api_events_user ON external_api_events(user_id);
CREATE INDEX idx_external_api_events_type ON external_api_events(event_type);
CREATE INDEX idx_external_api_events_endpoint ON external_api_events(endpoint);
CREATE INDEX idx_external_api_events_created ON external_api_events(created_at);
CREATE INDEX idx_external_api_events_org_type ON external_api_events(organization_id, event_type);
CREATE INDEX idx_external_api_events_org_created ON external_api_events(organization_id, created_at);

-- External API webhooks indexes
CREATE INDEX idx_external_api_webhooks_organization ON external_api_webhooks(organization_id);
CREATE INDEX idx_external_api_webhooks_type ON external_api_webhooks(webhook_type);
CREATE INDEX idx_external_api_webhooks_active ON external_api_webhooks(is_active);
CREATE INDEX idx_external_api_webhooks_triggered ON external_api_webhooks(last_triggered);

-- External API analytics indexes
CREATE INDEX idx_external_api_analytics_organization ON external_api_analytics(organization_id);
CREATE INDEX idx_external_api_analytics_metric ON external_api_analytics(metric_name);
CREATE INDEX idx_external_api_analytics_timestamp ON external_api_analytics(timestamp);
CREATE INDEX idx_external_api_analytics_org_metric ON external_api_analytics(organization_id, metric_name);
CREATE INDEX idx_external_api_analytics_org_timestamp ON external_api_analytics(organization_id, timestamp);

-- Composite indexes for common queries
CREATE INDEX idx_external_api_events_org_type_created ON external_api_events(organization_id, event_type, created_at);
CREATE INDEX idx_external_api_analytics_org_metric_timestamp ON external_api_analytics(organization_id, metric_name, timestamp);
