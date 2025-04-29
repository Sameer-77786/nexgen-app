import React, { useState } from 'react';
import Login from './components/Login';
import WidgetGrid from './components/WidgetGrid';
import Checklist from './components/Checklist';
import ChatRoom from './components/ChatRoom';
import VelocityPage from './components/VelocityPage';
import BottomNav from './components/BottomNav';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('nexgen_token'));
  const [screen, setScreen] = useState(token ? 'home' : 'login');
  const [user, setUser] = useState({ username: '', avatarUrl: '/default-avatar.png' });

  const handleLogin = async (tok) => {
    localStorage.setItem('nexgen_token', tok);
    setToken(tok);
    setScreen('home');

    // Fetch user info from WP
    try {
      const res = await fetch('/wp-json/wp/v2/users/me', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const u = await res.json();
      setUser({
        username: u.name || u.username || '',
        avatarUrl: u.avatar_urls?.['96'] || '/default-avatar.png',
      });
    } catch (err) {
      console.error('Failed to fetch user info:', err);
    }
  };

  const navigate = (key) => {
    setScreen(key);
  };

  if (!token) return <Login onLogin={handleLogin} />;

  let Content;
  switch (screen) {
    case 'home':
      Content = <WidgetGrid token={token} onNavigate={({ slug }) => navigate(slug)} />;
      break;
    case 'sales':
      Content = <div className="p-6 text-center">Sales Entry (Coming Soon)</div>;
      break;
    case 'checkin':
      Content = <div className="p-6 text-center">Check-In (Coming Soon)</div>;
      break;
    case 'goals':
      Content = <div className="p-6 text-center">Goals Tracker (Coming Soon)</div>;
      break;
    case 'chat':
      Content = <ChatRoom token={token} onBack={() => navigate('home')} />;
      break;
    case 'checklist':
      Content = <Checklist token={token} onBack={() => navigate('home')} />;
      break;
    case 'velocity':
      Content = <VelocityPage onBack={() => navigate('home')} />;
      break;
    case 'settings':
      Content = (
        <SettingsPage
          token={token}
          username={user.username}
          existingAvatar={user.avatarUrl}
          onBack={async () => {
            // ✅ Re-fetch user info after avatar upload
            try {
              const res = await fetch('/wp-json/wp/v2/users/me', {
                headers: { Authorization: `Bearer ${token}` },
              });
              const u = await res.json();
              const newAvatar = u.avatar_urls?.['96'] || '/default-avatar.png';

              // Only update if changed
              if (newAvatar !== user.avatarUrl) {
                setUser((prev) => ({ ...prev, avatarUrl: newAvatar }));
              }
            } catch (err) {
              console.error('Failed to refresh avatar:', err);
            } finally {
              // ⏳ Tiny delay to avoid render flash
              setTimeout(() => setScreen('home'), 100);
            }
          }}
        />
      );
      break;
    default:
      Content = <WidgetGrid token={token} onNavigate={({ slug }) => navigate(slug)} />;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Header with Avatar */}
      <header className="flex items-center justify-end p-2 bg-white border-b">
        <img
          src={user.avatarUrl || '/default-avatar.png'}
          alt="Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => navigate('settings')}
        />
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {Content}
      </div>

      {/* Bottom Navigation */}
      <BottomNav current={screen} onSelect={navigate} />
    </div>
  );
}
