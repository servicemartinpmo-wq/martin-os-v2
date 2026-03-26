export default function Terms() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-black">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 26, 2026</p>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            These terms govern your use of the Apphia platform, including workspace planning, Tech-Ops
            troubleshooting workflows, and AI-assisted recommendations. By using the service, you agree to
            follow applicable laws and your organization&apos;s internal policies.
          </p>
          <p>
            You are responsible for account security, access management, and ensuring that data entered into
            the system is lawful and authorized. Do not submit sensitive personal data unless your policies
            permit it and you have appropriate controls in place.
          </p>
          <p>
            AI-generated outputs are advisory. You remain responsible for operational, legal, and financial
            decisions taken from recommendations, automations, and playbooks.
          </p>
          <p>
            To request account support, billing assistance, or enterprise agreements, contact
            <a className="ml-1 text-electric-blue hover:underline" href="mailto:support@martinpmo.com">
              support@martinpmo.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
