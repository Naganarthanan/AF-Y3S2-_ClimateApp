export default function AuthShell({ eyebrow, title, description, children, asideTitle, asidePoints = [] }) {
  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/75 px-6 py-8 text-white shadow-[0_35px_120px_-45px_rgba(2,6,23,0.9)] lg:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.34),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.30),transparent_30%),linear-gradient(160deg,rgba(15,23,42,0.2),rgba(2,6,23,0.55))]" />
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-200">{eyebrow}</p>
              <h1 className="mt-4 max-w-lg font-['Sora'] text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200 md:text-base">{description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {asidePoints.map((point) => (
                <div key={point.label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-sky-100">{point.label}</p>
                  <p className="mt-2 text-sm text-white/85">{point.value}</p>
                </div>
              ))}
            </div>
            {asideTitle ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                <p className="text-lg font-semibold text-white">{asideTitle}</p>
                <p className="mt-2 text-sm leading-7 text-slate-200">
                  Preparedness, alerts, shelter access, and climate education are all brought together in one calm interface for citizens and teams.
                </p>
              </div>
            ) : null}
          </div>
        </section>
        <section className="card self-center p-6 sm:p-8">{children}</section>
      </div>
    </div>
  );
}
