// COMPONENT 1: Real-Time Climate Risk & Early Warning
// File: frontend/src/components/StatCard.jsx
export default function StatCard({ label, value }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-400 to-orange-300" />
      <div className="absolute -right-6 top-6 h-20 w-20 rounded-full bg-sky-400/10 blur-2xl" />
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </div>
  );
}
