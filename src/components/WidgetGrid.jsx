// src/components/WidgetGrid.jsx
import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

export default function WidgetGrid({ token }) {
  const [widgets, setWidgets] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch('https://mynexgenmobile.com/wp-json/nexgen/v1/widgets', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setWidgets)
      .catch(err => console.error('Widget fetch error:', err));
  }, [token]);
  

  // paginate into 6-per-page
  const pages = [];
  for (let i = 0; i < widgets.length; i += 6) {
    pages.push(widgets.slice(i, i + 6));
  }

  const handlers = useSwipeable({
    onSwipedLeft:  () => setPage(p => Math.min(p + 1, pages.length - 1)),
    onSwipedRight: () => setPage(p => Math.max(p - 1, 0))
  });

  return (
    <div {...handlers} className="h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center">Home</h1>
      <div className="grid grid-cols-2 gap-4">
        {pages[page]?.map((w, i) => (
          <div key={i} className={`p-4 rounded-lg shadow ${w.color}`}>
            <div className="text-3xl">{w.icon}</div>
            <div className="mt-2 font-semibold">{w.label}</div>
          </div>
        ))}
      </div>
      {/* pagination dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {pages.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${i === page ? 'bg-green-600' : 'bg-gray-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
