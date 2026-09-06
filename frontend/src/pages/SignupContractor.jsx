import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SignupContractor = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    area: '',
    requirements: '',
    password: '',
    confirmPassword: '', // <-- NEW
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: digits only, max 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, phone: digitsOnly });
      }
      return;
    }

    // For all other fields
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Password match validation ---
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, role: 'company' };
      // Remove confirmPassword before sending to backend
      delete payload.confirmPassword;

      const res = await axios.post('/api/auth/register/', payload);
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      login(res.data.user);
      navigate('/');
    } catch (err) {
      // Improved error handling
      let msg = 'Registration failed';
      if (err.response?.data) {
        const data = err.response.data;
        if (data.non_field_errors) {
          msg = data.non_field_errors[0];
        } else if (data.company_name) {
          msg = data.company_name[0];
        } else if (data.email) {
          msg = data.email[0];
        } else if (data.state) {
          msg = data.state[0];
        } else if (data.city) {
          msg = data.city[0];
        } else if (data.phone) {
          msg = data.phone[0];
        } else if (data.detail) {
          msg = data.detail;
        } else {
          const firstKey = Object.keys(data)[0];
          if (firstKey && data[firstKey]) {
            msg = `${firstKey}: ${data[firstKey][0]}`;
          }
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #edf0f3',
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#0a3142' }}>Contractor Sign Up</h2>
        <p style={{ textAlign: 'center', color: '#4d6d82', marginBottom: '1.5rem' }}>Register your company / contractor profile</p>
        <form onSubmit={handleSubmit}>
          {/* Company name & Contact person */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Company Name *</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                required
                placeholder="ABC Constructions"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Contact Person</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Ram"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="company@example.com"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                maxLength="10"
                onChange={handleChange}
                placeholder="10-digit phone"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
          </div>

          {/* State & City */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Jharkhand"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Ranchi"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
          </div>

          {/* Area */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Area / Locality</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Kadru, Doranda..."
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
          </div>

          {/* Requirements */}
          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Project Requirements / Description</label>
            <textarea
              name="requirements"
              rows="3"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Tell us about your project requirements..."
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '1rem', border: '1px solid #d0dce6', resize: 'vertical' }}
            />
          </div>

          {/* Password fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
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
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Retype Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
              />
            </div>
          </div>

          {error && <div style={{ color: '#c62828', marginTop: '1rem' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', background: '#0a3142', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Creating account...' : 'Sign Up as Contractor'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#0a3142', fontWeight: 600 }}>Login</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Link to="/signup/worker" style={{ color: '#f39c12', fontWeight: 600 }}>Sign up as Worker</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupContractor;