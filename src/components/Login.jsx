// src/components/Login.jsx
import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('https://mynexgenmobile.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: pass })
      });
      const data = await res.json();
      if (data.token) {
        onLogin(data.token);
      } else {
        setErr(data.message || 'Login failed');
      }
    } catch {
      setErr('Network error');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-xl mb-4 text-center">NexGen Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded">
          Log In
        </button>
      </form>
    </div>
  );
}
