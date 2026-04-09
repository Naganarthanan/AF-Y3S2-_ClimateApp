// COMPONENT 4: User + Education + Analytics
// File: frontend/src/pages/EducationDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../api/endpoints";
import PageHeader from "../components/PageHeader";

export default function EducationDetailPage() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  useEffect(() => { endpoints.educationById(id).then((res) => setDoc(res.data.data)); }, [id]);
  if (!doc) return <div className="card">Loading content...</div>;

  return (
    <div className="page-shell">
      <PageHeader
        eyebrow="Education Detail"
        title={doc.title}
        description="Use this learning resource to build stronger readiness habits before disruptive climate events occur."
        pills={[doc.disasterType, doc.type]}
      />
      <div className="card">
        <p className="text-sm leading-8 text-slate-200">
          {doc.bodyOrUrl.startsWith("http") ? <a className="font-semibold text-primary hover:text-sky-600" href={doc.bodyOrUrl} target="_blank" rel="noreferrer">Open Resource</a> : doc.bodyOrUrl}
        </p>
      </div>
    </div>
  );
}
