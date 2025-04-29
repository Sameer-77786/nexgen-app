// src/components/WidgetGrid.jsx
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaBolt } from 'react-icons/fa';

const TILE_MAP = {
  'store dashboard':   { icon: '📅',    color: 'bg-sky-400 text-black' },
  'sales entry':       { icon: '✏️',    color: 'bg-red-400 text-black'   },
  'goals tracker':     { icon: '🎯',    color: 'bg-yellow-300 text-black' },
  'commission':        { icon: '💵',    color: 'bg-green-200 text-black' },
  'checklist':         { icon: '📋',    color: 'bg-yellow-200 text-black' },
  'velocity':          { icon: <FaBolt size={32} />, color: 'bg-indigo-400 text-white' },
};

function normalizeLabel(label) {
  const clean = label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (clean.includes('velocity')) return 'velocity'; // ✅ Force slug to match App.jsx
  if (clean.includes('checklist')) return 'checklist';
  return clean;
}

export default function WidgetGrid({ token, onNavigate }) {
  const [widgets, setWidgets] = useState([]);
  const [page, setPage]       = useState(0);

  useEffect(() => {
    fetch('/wp-json/nexgen/v1/widgets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setWidgets(data))
      .catch(console.error);
  }, [token]);

  const pages = [widgets];

  const handlers = useSwipeable({
    onSwipedLeft:  () => setPage(p => Math.min(p + 1, pages.length - 1)),
    onSwipedRight: () => setPage(p => Math.max(p - 1, 0)),
    trackMouse: true
  });

  return (
    <div {...handlers} className="h-screen p-4 bg-gray-50 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-center">Home</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
        {pages[page]?.map((w, idx) => {
          const key = normalizeLabel(w.label);
          let tile = TILE_MAP[key];
          if (!tile && key.startsWith('check in')) {
            tile = { icon: '📍', color: 'bg-green-600 text-white' };
          }
          const { icon, color } = tile || { icon: '❔', color: 'bg-gray-200 text-black' };

          return (
            <div
              key={idx}
              onClick={() => onNavigate({ slug: key })}
              className={`${color} rounded-xl p-6 shadow cursor-pointer flex flex-col items-center justify-center`}
            >
              <div className="text-4xl mb-2">{icon}</div>
              <div className="font-semibold text-center">{w.label}</div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {pages.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === page ? 'bg-green-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
