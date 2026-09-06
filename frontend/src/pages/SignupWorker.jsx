import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SignupWorker = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    aadhaar: '',
    state: '',
    city: '',
    area: '',
    experience: '',
    description: '',
    password: '',
    confirmPassword: '', // NEW
    aadhar_image: null,
  });
  const [trades, setTrades] = useState([]);
  const [tradeInput, setTradeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Phone: digits only, max 10
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setFormData({ ...formData, phone: digitsOnly });
      }
      return;
    }

    if (name === 'aadhar_image') {
      setFormData({ ...formData, aadhar_image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support voice recording. Please type your description.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'en-IN';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;

    setIsRecording(true);

    recognitionInstance.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setFormData((prev) => ({ ...prev, description: transcript }));
    };

    recognitionInstance.onerror = (event) => {
      console.error(event.error);
      setIsRecording(false);
      alert('Voice error: ' + event.error);
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.start();
    setRecognition(recognitionInstance);
  };

  const stopVoiceRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Password match validation ---
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- Frontend phone validation (optional but helps UX) ---
    if (formData.phone && formData.phone.length === 10) {
      const firstDigit = formData.phone[0];
      if (!['6','7','8','9'].includes(firstDigit)) {
        setError('Phone number must start with 6, 7, 8, or 9.');
        return;
      }
    }

    setLoading(true);

    const data = new FormData();
    data.append('role', 'worker');
    for (const key in formData) {
      if (key === 'confirmPassword') continue; // skip
      if (formData[key] !== '' && formData[key] !== null && key !== 'aadhar_image') {
        data.append(key, formData[key]);
      }
    }
    if (formData.aadhar_image) {
      data.append('aadhar_image', formData.aadhar_image);
    }
    data.append('trade', JSON.stringify(trades));

    try {
      const res = await axios.post('/api/auth/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      login(res.data.user);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] ||
                  err.response?.data?.phone?.[0] ||
                  err.response?.data?.state?.[0] ||
                  err.response?.data?.city?.[0] ||
                  err.response?.data?.area?.[0] ||
                  err.response?.data?.trade?.[0] ||
                  err.response?.data?.experience?.[0] ||
                  'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div style={{
        background: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem 2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
        border: '1px solid #edf0f3',
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.2rem',
          fontWeight: 700,
          color: '#0a3142',
          marginBottom: '0.3rem',
        }}>Worker Sign Up</h2>
        <p style={{ textAlign: 'center', color: '#4d6d82', fontSize: '1.05rem', marginBottom: '2rem' }}>
          Join thousands of verified workers – it's free!
        </p>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem 1.8rem' }}>
            {/* First Name */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                First Name <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="e.g. Ram"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="e.g. Kumar"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Phone (updated) */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Phone <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength="10"
                required
                placeholder="9876543210"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Email <span style={{ color: '#5a7a8a', fontSize: '0.8rem' }}>(optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* State */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                State <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="Jharkhand"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* City */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                City <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="Ranchi"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Area */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Area / Locality <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
                placeholder="Kadru, Doranda..."
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Experience */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Experience (years) <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                min="0"
                placeholder="e.g. 5"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Aadhaar Number */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Aadhaar Number <span style={{ color: '#5a7a8a', fontSize: '0.8rem' }}>(optional)</span>
              </label>
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="1234 5678 9012"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>

            {/* Aadhar Image Upload */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Aadhar Image <span style={{ color: '#5a7a8a', fontSize: '0.8rem' }}>(optional)</span>
              </label>
              <input
                type="file"
                name="aadhar_image"
                accept="image/*"
                onChange={handleChange}
                style={{ width: '100%', padding: '0.4rem', border: '1px solid #d0dce6', borderRadius: '40px', fontSize: '0.9rem' }}
              />
            </div>

            {/* Password & Confirm Password (updated) */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Password <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
                Retype Password <span style={{ color: '#d32f2f' }}>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
            </div>
          </div>

          {/* Skills / Trades */}
          <div style={{ marginTop: '1.8rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
              Skills / Trades <span style={{ color: '#d32f2f' }}>*</span>
              <span style={{ color: '#5a7a8a', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                (add one by one)
              </span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={tradeInput}
                onChange={(e) => setTradeInput(e.target.value)}
                onKeyDown={handleTradeKeyDown}
                placeholder="e.g. Mason"
                style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe' }}
              />
              <button
                type="button"
                onClick={addTrade}
                style={{ padding: '0.7rem 1.8rem', background: '#0a3142', color: '#fff', border: 'none', borderRadius: '40px', fontWeight: 600, cursor: 'pointer', transition: '0.15s', fontSize: '1rem' }}
                onMouseEnter={(e) => e.target.style.background = '#1e4f68'}
                onMouseLeave={(e) => e.target.style.background = '#0a3142'}
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
            {trades.length === 0 && (
              <div style={{ color: '#d32f2f', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '0.3rem' }}></i>
                At least one skill is required.
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.3rem', color: '#1b4155', fontSize: '1rem' }}>
              Description <span style={{ color: '#5a7a8a', fontSize: '0.85rem' }}>(optional)</span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your skills and experience..."
                style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '1rem', border: '1px solid #d0dce6', fontSize: '1rem', background: '#fafcfe', resize: 'vertical' }}
              />
              <button
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                style={{
                  background: isRecording ? '#d32f2f' : '#f39c12',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: '0.2s',
                  flexShrink: 0,
                  boxShadow: isRecording ? '0 0 0 4px rgba(211,47,47,0.2)' : '0 4px 12px rgba(243,156,18,0.3)',
                }}
                title={isRecording ? 'Stop recording' : 'Record voice'}
              >
                <i className={`fas fa-${isRecording ? 'stop' : 'microphone'}`}></i>
              </button>
            </div>
            {isRecording && (
              <div style={{ marginTop: '0.3rem', fontSize: '0.95rem', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="pulsing-dot" style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#d32f2f',
                  animation: 'pulse 1s infinite',
                }}></span>
                Recording... Speak clearly.
              </div>
            )}
            <div style={{ fontSize: '0.85rem', color: '#5a7a8a', marginTop: '0.2rem' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '0.3rem' }}></i>
              <span className="lang-en">Type or click the microphone to speak (English/Hindi).</span>
              <span className="lang-hi">टाइप करें या माइक्रोफोन पर क्लिक करके बोलें (अंग्रेज़ी/हिंदी)।</span>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: '1.5rem', padding: '0.8rem 1.2rem', background: '#ffebee', color: '#c62828', borderRadius: '0.8rem', fontSize: '1rem' }}>
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '2rem',
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #0a3142, #1a4a5e)',
              color: '#fff',
              border: 'none',
              borderRadius: '40px',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: '0.25s',
              boxShadow: '0 4px 16px rgba(10,49,66,0.2)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                Creating account...
              </>
            ) : (
              'Sign Up as Worker'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #edf0f3', paddingTop: '1.5rem' }}>
          <p style={{ color: '#4d6d82', fontSize: '1rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0a3142', fontWeight: 600, textDecoration: 'underline' }}>
              Login
            </Link>
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '1rem' }}>
            <Link to="/signup/contractor" style={{ color: '#f39c12', fontWeight: 600 }}>
              <i className="fas fa-building" style={{ marginRight: '0.3rem' }}></i>
              Sign up as Contractor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(style);

export default SignupWorker;