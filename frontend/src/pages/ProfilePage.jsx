// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trades, setTrades] = useState([]);
  const [tradeInput, setTradeInput] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8001/api/profile/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setTrades(res.data.trade || []);
      setDescription(res.data.description || '');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const addTrade = () => {
    const trimmed = tradeInput.trim();
    if (trimmed && !trades.includes(trimmed)) {
      setTrades([...trades, trimmed]);
      setTradeInput('');
    }
  };

  const removeTrade = (tradeToRemove) => {
    setTrades(trades.filter(t => t !== tradeToRemove));
  };

  const handleTradeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTrade();
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        trade: trades,
        description: description,
      };
      const res = await axios.patch('http://127.0.0.1:8001/api/profile/', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully!');
      setProfile(res.data);
      setTrades(res.data.trade || []);
      setDescription(res.data.description || '');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile');
    }
  };

  if (loading) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (!profile) return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>No profile found</div>;

  // rest of the JSX as before...


  return (
    <div className="container" style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #edf0f3',
      }}>
        <h2 style={{ fontSize: '2rem', color: '#0a3142', marginBottom: '0.5rem' }}>My Profile</h2>
        <p style={{ color: '#4d6d82', marginBottom: '1.5rem' }}>Update your information below</p>

        {error && <div style={{ color: '#c62828', marginBottom: '1rem' }}>{error}</div>}
        {success && <div style={{ color: '#2e7d32', marginBottom: '1rem' }}>{success}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem 1.8rem' }}>
          <div><strong>First Name:</strong> {profile.name?.split(' ')[0] || ''}</div>
          <div><strong>Last Name:</strong> {profile.name?.split(' ').slice(1).join(' ') || ''}</div>
          <div><strong>Phone:</strong> {profile.phone}</div>
          <div><strong>Email:</strong> {profile.user?.email || 'Not provided'}</div>
          <div><strong>State:</strong> {profile.state}</div>
          <div><strong>City:</strong> {profile.location}</div>
          <div><strong>Area:</strong> {profile.area}</div>
          <div><strong>Experience:</strong> {profile.experience} years</div>
          <div><strong>Aadhaar:</strong> {profile.aadhaar_number || 'Not provided'}</div>
          <div><strong>Verified:</strong> {profile.verified ? 'Yes' : 'No'}</div>
        </div>

        <hr style={{ margin: '1.8rem 0', borderColor: '#edf0f3' }} />

        {/* Editable: Skills / Trades */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155' }}>
            Skills / Trades <span style={{ color: '#5a7a8a', fontSize: '0.8rem' }}>(add/remove)</span>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={tradeInput}
              onChange={(e) => setTradeInput(e.target.value)}
              onKeyDown={handleTradeKeyDown}
              placeholder="e.g. Mason"
              style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6' }}
            />
            <button
              type="button"
              onClick={addTrade}
              style={{ padding: '0.7rem 1.8rem', background: '#0a3142', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 600, cursor: 'pointer' }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.6rem' }}>
            {trades.map((trade) => (
              <span key={trade} style={{
                background: '#eef2f5',
                padding: '0.35rem 1rem',
                borderRadius: '30px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: '#0a3142',
              }}>
                {trade}
                <button
                  type="button"
                  onClick={() => removeTrade(trade)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '1.2rem', lineHeight: 1, padding: '0 0.2rem' }}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Editable: Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155' }}>
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your skills and experience..."
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '1rem', border: '1px solid #d0dce6', fontSize: '1rem', resize: 'vertical' }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            padding: '0.8rem 2.5rem',
            background: '#0a3142',
            color: '#fff',
            border: 'none',
            borderRadius: '40px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.2s',
            marginRight: '1rem',
          }}
          onMouseEnter={(e) => e.target.style.background = '#1e4f68'}
          onMouseLeave={(e) => e.target.style.background = '#0a3142'}
        >
          Save Changes
        </button>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          style={{
            padding: '0.8rem 2rem',
            background: '#d32f2f',
            color: '#fff',
            border: 'none',
            borderRadius: '40px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => e.target.style.background = '#b71c1c'}
          onMouseLeave={(e) => e.target.style.background = '#d32f2f'}
        >
          <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;