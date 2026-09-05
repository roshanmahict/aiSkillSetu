import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:8001/api/auth/confirm-reset-password/', {
        uid,
        token,
        new_password: password,
      });
      setMessage(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired link. Please request a new one.');
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
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#0a3142' }}>Reset Password</h2>
        <p style={{ textAlign: 'center', color: '#4d6d82', marginBottom: '1.5rem' }}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>New Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimum 8 characters"
              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem' }}>Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-enter your password"
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" style={{ color: '#0a3142', fontWeight: 600 }}>Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;