// src/features/education/Education.jsx
import { useState } from 'react';

const mockArticles = [
  {
    id: 1,
    title: "Understanding Flood Risks in North Central Province",
    summary: "Heavy monsoon rains increase flood probability by 40% in Anuradhapura district...",
    category: "Flood",
    readTime: "6 min",
  },
  {
    id: 2,
    title: "Drought-Resistant Crops for Dry Zone Farmers",
    summary: "Best practices and crop varieties suitable for low-rainfall regions...",
    category: "Drought",
    readTime: "8 min",
  },
  // ...
];

export default function Education() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Flood', 'Drought', 'Heatwave', 'Early Warning'];

  const filteredArticles =
    activeCategory === 'All'
      ? mockArticles
      : mockArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Climate Education & Awareness</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-teal-500" /> {/* Placeholder image */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500">{article.readTime}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {article.summary}
              </p>
              <button className="mt-4 text-blue-600 hover:underline text-sm font-medium">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No resources found in this category.
        </div>
      )}
    </div>
  );
}