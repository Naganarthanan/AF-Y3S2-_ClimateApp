// src/features/emergency/Emergency.jsx
import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // ← react-leaflet use பண்ணலாம் (npm install react-leaflet leaflet)

// Default icon fix (vite/react-ஆ இருந்தா)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const emergencyTypes = {
  shelter: { color: '#3b82f6', icon: '🏠' },
  hospital: { color: '#ef4444', icon: '🏥' },
  relief: { color: '#f59e0b', icon: '📦' },
  police: { color: '#6b7280', icon: '👮' },
};

const mockEmergencyResources = [
  {
    id: 1,
    name: 'Anuradhapura District Shelter',
    type: 'shelter',
    address: 'Near Anuradhapura General Hospital',
    contact: '011-2XXX-XXX',
    position: [8.3114, 80.4037],
    status: 'Open 24/7',
  },
  {
    id: 2,
    name: 'Colombo National Hospital',
    type: 'hospital',
    address: 'Regent Street, Colombo 10',
    contact: '011-2691111',
    position: [6.9271, 79.8612],
    status: 'Emergency Dept Open',
  },
  {
    id: 3,
    name: 'Gampaha Relief Center',
    type: 'relief',
    address: 'Gampaha Town Hall Area',
    contact: '033-222XXXX',
    position: [7.0917, 79.9941],
    status: 'Stock Available',
  },
  // ... more can come from API
];

export default function Emergency() {
  const [resources, setResources] = useState(mockEmergencyResources);
  const [selectedType, setSelectedType] = useState('all');
  const center = [7.8731, 80.7718]; // Approx Sri Lanka center
  const zoom = 7;

  // Optional: real API fetch
  useEffect(() => {
    // fetch('/api/emergency-resources')
    //   .then(res => res.json())
    //   .then(data => setResources(data))
    //   .catch(err => console.error('Failed to load resources', err));
  }, []);

  const filteredResources =
    selectedType === 'all'
      ? resources
      : resources.filter(r => r.type === selectedType);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-red-700">
        Emergency Resources & Support
      </h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition ${
            selectedType === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          All Resources
        </button>

        {Object.keys(emergencyTypes).map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${
              selectedType === type
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <span>{emergencyTypes[type].icon}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-md">
          <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {filteredResources.map(resource => {
              const { color, icon } = emergencyTypes[resource.type];
              return (
                <Marker
                  key={resource.id}
                  position={resource.position}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: <div style="background:${color}; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:3px solid white; box-shadow:0 0 6px rgba(0,0,0,0.4)">${icon}</div>,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                  })}
                >
                  <Popup>
                    <div className="min-w-[220px]">
                      <h3 className="font-bold text-lg">{resource.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{resource.address}</p>
                      <p className="mt-2">
                        <strong>Contact:</strong> {resource.contact}
                      </p>
                      <p className="mt-1">
                        <strong>Status:</strong> <span className="text-green-600">{resource.status}</span>
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* List Section */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No resources found for selected category
            </div>
          ) : (
            filteredResources.map(resource => {
              const { color, icon } = emergencyTypes[resource.type];
              return (
                <div
                  key={resource.id}
                  className="p-5 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: color + '22', color }}
                    >
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{resource.name}</h3>
                      <p className="text-sm text-gray-600">{resource.address}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm">
                        <span><strong>Contact:</strong> {resource.contact}</span>
                        <span className="text-green-600 font-medium">{resource.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Emergency Hotline Banner */}
      <div className="mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
        <h2 className="text-xl font-bold text-red-700 mb-2">
          National Emergency Hotline
        </h2>
        <p className="text-2xl font-black text-red-600">1990 / 011-2XXX-XXX</p>
        <p className="text-sm text-gray-600 mt-2">
          For immediate help in disasters or climate emergencies
        </p>
      </div>
    </div>
  );
}