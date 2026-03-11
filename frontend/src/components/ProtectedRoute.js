import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div className="loader" />
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          AUTHENTICATING...
        </p>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
