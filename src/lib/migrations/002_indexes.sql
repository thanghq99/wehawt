-- Performance indexes for core tables
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_custom_domain ON organizations(custom_domain);
CREATE INDEX idx_organization_members_user ON organization_members(user_id);
CREATE INDEX idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);

-- Performance indexes for tenant-specific tables
CREATE INDEX idx_pages_organization_slug ON pages(organization_id, slug);
CREATE INDEX idx_pages_organization_published ON pages(organization_id, is_published);
CREATE INDEX idx_products_organization ON products(organization_id);
CREATE INDEX idx_products_organization_available ON products(organization_id, is_available);
CREATE INDEX idx_orders_organization ON orders(organization_id);
CREATE INDEX idx_orders_organization_status ON orders(organization_id, status);
CREATE INDEX idx_content_organization ON content(organization_id);
CREATE INDEX idx_content_organization_published ON content(organization_id, is_published);
CREATE INDEX idx_media_organization ON media(organization_id);
CREATE INDEX idx_analytics_organization_date ON analytics(organization_id, created_at);

-- Covering indexes for common queries
CREATE INDEX idx_org_members_user_role ON organization_members(user_id, role) 
INCLUDE (organization_id, permissions);

-- Composite indexes for tenant resolution
CREATE INDEX idx_organizations_domain_ssl ON organizations(custom_domain, ssl_verified) 
WHERE custom_domain IS NOT NULL;
