import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
    role: 'worker',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.role === 'worker') {
        delete payload.email; // optional for workers
      } else {
        delete payload.phone; // optional for companies
      }
      const res = await axios.post('http://127.0.0.1:8001/api/auth/register/', payload);

      // Store tokens
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // Use auth context to set user – navbar will update instantly
      login(res.data.user);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] ||
                  err.response?.data?.phone?.[0] ||
                  err.response?.data?.email?.[0] ||
                  'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Role *</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
          >
            <option value="worker">Worker</option>
            <option value="company">Company / Builder</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>First Name *</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Phone * (for workers)</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
            required={formData.role === 'worker'}
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Email * (for companies)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required={formData.role === 'company'}
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#0a3142', fontWeight: 600 }}>Login</Link>
      </p>
    </div>
  );
};

export default Signup;