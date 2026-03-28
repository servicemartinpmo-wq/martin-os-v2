import AppShell from '@/features/shell/AppShell'
import { PageHeader, PageSection } from '@/components/page/PageChrome'
import { ONTOLOGY_ENTITY_TYPES, ONTOLOGY_CONNECTORS } from '@/lib/ontologyRegistry'

export default function OntologyPage() {
  return (
    <AppShell activeHref="/settings">
      <PageHeader
        kicker="Data OS"
        title="Ontology & connectors"
        subtitle="Typed entities and connector framework — security review per source before production enablement."
      />
      <PageSection title="Entity types (stub)">
        <ul className="grid gap-2 sm:grid-cols-2">
          {ONTOLOGY_ENTITY_TYPES.map((t) => (
            <li key={t.id} className="mos-surface-deep p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {t.label}
              </span>{' '}
              · {t.category} · {t.status}
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection title="Connectors (stub)">
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {ONTOLOGY_CONNECTORS.map((c) => (
            <li key={c.id}>
              {c.label} — {c.transport} ({c.status})
            </li>
          ))}
        </ul>
      </PageSection>
    </AppShell>
  )
}
