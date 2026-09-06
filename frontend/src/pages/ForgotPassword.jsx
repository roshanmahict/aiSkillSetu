import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('/api/auth/request-reset-email/', { phone });
      setMessage(res.data.message || 'Reset link sent to your email if registered.');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #edf0f3',
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#0a3142' }}>Forgot Password</h2>
        <p style={{ textAlign: 'center', color: '#4d6d82', marginBottom: '1.5rem' }}>
          Enter your phone number. If you have a registered email, we'll send you a reset link.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              maxLength="10"
              required
              placeholder="9876543210"
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
          </div>

          {message && <div style={{ color: '#2e7d32', marginTop: '1rem' }}>{message}</div>}
          {error && <div style={{ color: '#c62828', marginTop: '1rem' }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '0.8rem',
              background: '#0a3142',
              color: '#fff',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Remember your password? <Link to="/login" style={{ color: '#0a3142', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;