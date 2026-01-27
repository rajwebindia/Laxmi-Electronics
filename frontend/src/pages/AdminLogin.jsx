import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeRecaptcha } from '../utils/recaptcha';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const recaptchaToken = await executeRecaptcha('admin_login');
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, recaptchaToken, recaptchaAction: 'admin_login' }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        setError(errorData.message || `Server error: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('fetch')) {
        setError('Cannot connect to server. Please make sure the backend server is running on port 3001.');
      } else {
        setError('Network error. Please check if the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#08222B] to-[#0a2d3a] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/assets/logo.png" 
                alt="Laxmi Electronics Logo" 
                className="h-16 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#08222B] mb-2">Admin Login</h1>
            <p className="text-gray-600">Laxmi Electronics Admin Panel</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent outline-none"
                placeholder="Enter username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#08222B] focus:border-transparent outline-none"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#08222B] text-white py-3 rounded-lg font-semibold hover:bg-[#0a2d3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Default credentials:</p>
            <p className="font-mono text-xs mt-1">Username: admin</p>
            <p className="font-mono text-xs">Password: admin123</p>
            <p className="text-red-600 mt-2">⚠️ Change default password after first login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
