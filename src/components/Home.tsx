import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { GAME_BASE_URL } from '../config/config.ts';
import { NewsFeed } from './NewsFeed';

/**
 * Home Component Module
 * Main landing page for authenticated users
 */
export function Home() {
  const { isAuthenticated, player, logout, validateSession } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login');
    }
  };

  const openWithGet = (url: string, params: string | null) => {
    window.open(url + "?token=" + params, "_blank");
  }

  const handleGame = async () => {
    if (!validateSession()) {
      await handleLogout();
      return;
    }

    const authToken = getCookie('auth_token');
    openWithGet(GAME_BASE_URL, authToken);
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift() || null;
    return null;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!validateSession()) {
      void (async () => {
        try {
          await logout();
        } finally {
          navigate('/login');
        }
      })();
    }
  }, [isAuthenticated, logout, navigate, validateSession]);

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <div className="home-card">
          <h1>Welcome to City Builder</h1>
          <p>Build and manage your own virtual city!</p>
          <div className="home-actions">
            <button onClick={() => navigate('/login')} className="btn-primary">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn-secondary">
              Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <div className="news-section">
        <NewsFeed />
      </div>
      <div className="user-section">
        <div className="home-card">
          <h1>Welcome back, {player?.username}!</h1>
          <div className="user-info">
            <h2>Player Dashboard</h2>
            <p>This is where your city building adventure begins!</p>
            <p className="info-text">
              Future features will include:
            </p>
            <ul>
              <li>City management</li>
              <li>Resource tracking</li>
              <li>News and updates</li>
              <li>Leaderboards</li>
            </ul>
          </div>
          <div className="home-actions">
            <button onClick={handleGame} className="btn-primary">
              Play Game
            </button>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
