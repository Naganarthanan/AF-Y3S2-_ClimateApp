// COMPONENT 3: Emergency Resource & Shelter Logistics
// File: frontend/src/pages/ShelterDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import PageHeader from "../components/PageHeader";

export default function ShelterDetailPage() {
  const { id } = useParams();
  const [shelter, setShelter] = useState(null);
  const [resources, setResources] = useState([]);

  useEffect(() => { endpoints.shelterById(id).then((res) => setShelter(res.data.data)); endpoints.resources(id).then((res) => setResources(res.data.data)); }, [id]);
  if (!shelter) return <div className="card">Loading shelter...</div>;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Shelter Detail"
        title={shelter.name}
        description={shelter.address}
        pills={[`Capacity ${shelter.capacity}`, `Occupancy ${shelter.currentOccupancy}`]}
        actions={<a className="btn" href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a>}
      />
      <div className="glass-table">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="section-title">Resource Stocks</h2>
        </div>
        <div className="overflow-x-auto px-5 py-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="pb-3">Category</th>
                <th className="pb-3">Item</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3">Unit</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => <tr key={r._id} className="border-t border-white/10 text-slate-200"><td className="py-3">{r.category}</td><td className="py-3 font-semibold text-white">{r.itemName}</td><td className="py-3">{r.quantity}</td><td className="py-3">{r.unit}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
