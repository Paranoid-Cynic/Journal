import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Login from './components/Login';
import Journal from './components/Journal';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setView('journal');
      } else {
        setView('login');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      {view === 'login' && <Login onLogin={() => setView('journal')} />}
      {view === 'journal' && user && <Journal />}
      {view === 'journal' && !user && <Login onLogin={() => setView('journal')} />}
    </div>
  );
}

export default App;

