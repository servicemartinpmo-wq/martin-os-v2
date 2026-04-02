-- ==========================================
-- 16. INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==========================================

-- Action Directives Indexes
CREATE INDEX IF NOT EXISTS idx_action_directives_status ON public.action_directives(status);
CREATE INDEX IF NOT EXISTS idx_action_directives_category ON public.action_directives(category);
CREATE INDEX IF NOT EXISTS idx_action_directives_priority_tier ON public.action_directives(priority_tier);
CREATE INDEX IF NOT EXISTS idx_action_directives_owner_id ON public.action_directives(owner_id);
CREATE INDEX IF NOT EXISTS idx_action_directives_initiative_id ON public.action_directives(initiative_id);

-- Team Capacity Indexes
CREATE INDEX IF NOT EXISTS idx_team_capacity_status ON public.team_capacity(status);
CREATE INDEX IF NOT EXISTS idx_team_capacity_department ON public.team_capacity(department);
CREATE INDEX IF NOT EXISTS idx_team_capacity_load_percentage ON public.team_capacity(load_percentage);

-- ==========================================
-- 17. ADDITIONAL CONSTRAINTS & TRIGGERS
-- ==========================================

-- Ensure updated_at is refreshed on action_directives
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_action_directives_updated_at
    BEFORE UPDATE ON public.action_directives
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
