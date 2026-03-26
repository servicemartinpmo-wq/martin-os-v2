export default function Privacy() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-black">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: March 26, 2026</p>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            Apphia stores account, workspace, and usage data to provide planning, reporting, and
            troubleshooting functionality. We use this data to operate core features, secure the product,
            and improve quality.
          </p>
          <p>
            We do not sell personal information. Data may be processed by trusted infrastructure providers
            required to run authentication, storage, and model APIs.
          </p>
          <p>
            Access controls, authentication, and role-based restrictions are used to protect workspace data.
            You are responsible for assigning permissions correctly inside your organization.
          </p>
          <p>
            For data requests, deletion requests, or privacy concerns, contact
            <a className="ml-1 text-electric-blue hover:underline" href="mailto:privacy@martinpmo.com">
              privacy@martinpmo.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
