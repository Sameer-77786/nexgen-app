import React, { useState, useEffect } from 'react';

const COLORS = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-yellow-500'];
function getColorForName(name) {
  if (!name) return COLORS[0];
  const code = Array.from(name).reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return COLORS[code % COLORS.length];
}

export default function SettingsPage({ token, onBack, username, existingAvatar }) {
  const [avatarUrl, setAvatarUrl] = useState(existingAvatar || '');
  const [, setAvatarFile] = useState(null);  // ✅ Only keeping setter to avoid ESLint warning
  const [pushEnabled, setPushEnabled] = useState(false);
  const [, setSaving] = useState(false);     // ✅ Only keeping setter to avoid ESLint warning
  const [showRemove, setShowRemove] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/wp-json/nexgen/v1/user-settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setAvatarUrl(data.avatar_url || existingAvatar || '');
        setPushEnabled(data.push_notifications);
      } catch (e) {
        console.error('Could not load settings', e);
      }
    })();
  }, [token, existingAvatar]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarUrl(previewUrl);
    setShowRemove(true);

    // Auto-save right after file selection
    setSaving(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      form.append('push_notifications', pushEnabled ? '1' : '0');

      const res = await fetch('/wp-json/nexgen/v1/user-settings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Save failed');
      onBack(); // 🔁 Trigger re-fetch in App
    } catch (err) {
      console.error(err);
      alert('Error saving image: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setAvatarUrl('');
    setAvatarFile(null);
    setShowRemove(false);
    setSaving(true);
    try {
      const form = new FormData();
      form.append('remove_avatar', '1');
      form.append('push_notifications', pushEnabled ? '1' : '0');

      const res = await fetch('/wp-json/nexgen/v1/user-settings', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Remove failed');
      onBack();
    } catch (err) {
      alert('Error removing avatar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const initial = username ? username.charAt(0).toUpperCase() : '';
  const defaultColor = getColorForName(username);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Back button */}
      <div className="p-4 border-b">
        <button onClick={onBack} className="text-blue-600">← Back</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Avatar section */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
          {!avatarUrl ? (
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl mb-2 ${defaultColor}`}
              aria-label={initial}
            >
              {initial}
            </div>
          ) : (
            <img
              src={avatarUrl}
              alt="Your avatar"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1"
          />

          {/* Show remove only after upload */}
          {showRemove && (
            <button
              onClick={handleRemoveAvatar}
              className="mt-2 text-sm text-red-500 underline"
            >
              Remove Avatar
            </button>
          )}
        </div>

        {/* Push toggle */}
        <div className="flex items-center">
          <input
            id="pushToggle"
            type="checkbox"
            checked={pushEnabled}
            onChange={e => setPushEnabled(e.target.checked)}
            className="form-checkbox h-5 w-5 text-green-600"
          />
          <label htmlFor="pushToggle" className="ml-2 text-gray-700">
            Enable Push Notifications
          </label>
        </div>
      </div>
    </div>
  );
}
