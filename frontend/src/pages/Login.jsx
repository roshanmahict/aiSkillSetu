import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8001/api/auth/login/', {
        identifier,
        password,
      });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      login(res.data.user);   // ✅ uses context
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Phone / Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter phone or email"
            required
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
          />
        </div>
        {error && <div style={{ color: '#c62828', marginBottom: '1rem' }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '0.8rem', background: '#0a3142', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account?{' '}
        <Link to="/signup/worker" style={{ color: '#0a3142', fontWeight: 600 }}>Sign up as Worker</Link>
        {' or '}
        <Link to="/signup/contractor" style={{ color: '#f39c12', fontWeight: 600 }}>Sign up as Contractor</Link>
      </p>
      <Link to="/forgot-password" style={{ color: '#0a3142', fontSize: '0.9rem' }}>
        Forgot Password?
        </Link>
    </div>
  );
};

export default Login;