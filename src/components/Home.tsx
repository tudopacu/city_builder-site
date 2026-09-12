import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { GAME_BASE_URL } from '../config/config.ts';
import { NewsFeed } from './NewsFeed';

const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/**
 * Home Component Module
 * Main landing page for authenticated users
 */
export function Home() {
  const { isAuthenticated, player, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const openWithGet = (url: string, params: string | null) => {
    window.open(url + "?token=" + params, "_blank");
  }

  const handleGame = async () => {
    const authToken = getCookie('auth_token');

    if (!authToken) {
      await handleLogout();
      return;
    }

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
      return;
    }

    const authToken = getCookie('auth_token');
    const lastLoginAt = localStorage.getItem('city_builder_last_login_at');
    const sessionAge = lastLoginAt ? Date.now() - Number(lastLoginAt) : Number.NaN;

    if (!authToken || Number.isNaN(sessionAge) || sessionAge > SESSION_MAX_AGE_MS) {
      void logout().then(() => navigate('/login'));
    }
  }, [isAuthenticated, logout, navigate]);

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
