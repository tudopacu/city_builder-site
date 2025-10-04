import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';

/**
 * Home Component Module
 * Main landing page for authenticated users
 */
export function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
    <div className="home-container">
      <div className="home-card">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Email: {user?.email}</p>
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
        <button onClick={handleLogout} className="btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
}
