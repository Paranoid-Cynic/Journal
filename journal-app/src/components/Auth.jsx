import React, { useState, useEffect } from 'react';
import { auth, GoogleAuthProvider, signInWithPopup, signOut } from '../firebase';

const Auth = ({ onAuthChange }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      onAuthChange(u);
    });
    return unsubscribe;
  }, [onAuthChange]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (user) {
    return (
      <div className="auth-section">
        <span>Welcome, {user.displayName}!</span>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-section">
      <button onClick={googleSignIn} className="google-signin-btn">
        Sign in with Google
      </button>
    </div>
  );
};

export default Auth;

