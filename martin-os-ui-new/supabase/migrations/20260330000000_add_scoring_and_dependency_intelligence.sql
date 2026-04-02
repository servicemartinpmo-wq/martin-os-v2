-- Category Formulas for Maturity Score
CREATE OR REPLACE FUNCTION calculate_maturity_score(dept_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    alignment_score INT;
    execution_score INT;
    final_score NUMERIC;
BEGIN
    -- Strategic Alignment: Completed tasks vs OKR links
    SELECT (COUNT(*) FILTER (WHERE okr_id IS NOT NULL)::FLOAT / NULLIF(COUNT(*), 0)) * 100 
    INTO alignment_score FROM initiatives WHERE department_id = dept_id;

    -- Execution Discipline: On-time completion rate
    SELECT (COUNT(*) FILTER (WHERE status = 'done' AND completed_at <= due_date)::FLOAT / NULLIF(COUNT(*), 0)) * 100 
    INTO execution_score FROM tasks WHERE department_id = dept_id;

    final_score := (COALESCE(alignment_score, 0) * 0.4) + (COALESCE(execution_score, 0) * 0.6);
    RETURN ROUND(final_score, 2);
END;
$$ LANGUAGE plpgsql;

-- 1F. DEPENDENCY INTELLIGENCE: Detect cascading delays
CREATE OR REPLACE VIEW dependency_risk_alerts AS
SELECT 
    i.id as initiative_id,
    i.name,
    COUNT(d.id) as blocked_by_count,
    SUM(CASE WHEN d.status != 'done' AND d.due_date < NOW() THEN 1 ELSE 0 END) as cascading_risk_level
FROM initiatives i
JOIN initiative_dependencies id ON i.id = id.initiative_id
JOIN initiatives d ON id.depends_on_id = d.id
GROUP BY i.id;
