import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { TopMenu } from './components/TopMenu';
import './App.css';

/**
 * Main App Component
 * Configures routing and authentication provider
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <TopMenu />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
