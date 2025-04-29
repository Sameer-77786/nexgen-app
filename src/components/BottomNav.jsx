// src/components/BottomNav.jsx
import React from 'react';
import {
  FaHome,
  FaChartBar,
  FaMapPin,
  FaBullseye,
  FaCommentDots
} from 'react-icons/fa';

export default function BottomNav({ current, onSelect }) {
  const tabs = [
    { key: 'home',    icon: <FaHome size={20} />,       label: 'Home'    },
    { key: 'sales',   icon: <FaChartBar size={20} />,   label: 'Sales'   },
    { key: 'checkin', icon: <FaMapPin size={20} />,     label: 'Check-In'},
    { key: 'goals',   icon: <FaBullseye size={20} />,   label: 'Goals'   },
    { key: 'chat',    icon: <FaCommentDots size={20} />,label: 'Chat'    },
  ];

  return (
    <nav className="flex bg-white border-t shadow-md">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          className={`flex-1 py-2 flex flex-col items-center justify-center text-sm
            ${current === t.key ? 'text-green-600' : 'text-gray-500'}
          `}
        >
          {t.icon}
          <span className="mt-1">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
