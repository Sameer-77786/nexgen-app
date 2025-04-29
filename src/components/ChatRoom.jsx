// src/components/ChatRoom.jsx
import React from 'react';
export default function ChatRoom({ onBack }) {
  return (
    <div className="h-screen flex flex-col">
      <button onClick={onBack} className="p-4 text-blue-600">← Back</button>
      {/* existing chat UI here */}
    </div>
  );
}