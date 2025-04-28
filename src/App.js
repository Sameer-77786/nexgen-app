import React, { useState } from 'react';
import Login from './components/Login';
import WidgetGrid from './components/WidgetGrid';

function App() {
  const [token, setToken] = useState(localStorage.getItem('nexgen_token'));

  const handleLogin = tok => {
    localStorage.setItem('nexgen_token', tok);
    setToken(tok);
  };

  return (
    token
      ? <WidgetGrid token={token} />
      : <Login onLogin={handleLogin} />
  );
}

export default App;
