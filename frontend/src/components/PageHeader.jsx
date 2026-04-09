export default function PageHeader({ eyebrow, title, description, actions, pills = [] }) {
  return (
    <section className="page-hero">
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="hero-title mt-3">{title}</h1>
          {description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{description}</p> : null}
          {pills.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {pills.map((pill) => (
                <span key={pill} className="pill">
                  {pill}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {actions ? <div className="relative z-10 flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}
