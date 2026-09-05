import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../utils/translations';

const ContactPage = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const fullName = `${formData.name} ${formData.last_name}`.trim();
      const payload = {
        name: fullName || formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', last_name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 className="section-title">{t('contactTitle')}</h2>
      <p className="section-sub">{t('contactSub')}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '3rem',
        background: '#fff',
        borderRadius: '2rem',
        padding: '2.5rem',
        border: '1px solid #edf0f3',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      }}>
        {/* LEFT COLUMN – Contact Info */}
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#0a3142' }}>
            <span className="lang-en">Get in touch</span>
            <span className="lang-hi">संपर्क करें</span>
          </h3>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <i className="fas fa-phone-alt" style={{ color: '#f39c12', width: '1.5rem' }}></i>
              <div>
                <strong>{t('contactPhone')}</strong>
                <div><a href="tel:6205386407">6205386407</a></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <i className="fas fa-envelope" style={{ color: '#f39c12', width: '1.5rem' }}></i>
              <div>
                <strong>{t('contactEmail')}</strong>
                <div><a href="mailto:info@aiskillsetu.com">info@aiskillsetu.com</a></div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <i className="fas fa-map-marker-alt" style={{ color: '#f39c12', width: '1.5rem' }}></i>
              <div>
                <strong>{t('contactAddress')}</strong>
                <div>Jharkhand, India</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#f6f8fa',
            borderRadius: '1.2rem',
            padding: '1.5rem',
            marginTop: '1.5rem',
          }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#0a3142' }}>
              <span className="lang-en">Working Hours</span>
              <span className="lang-hi">कार्य समय</span>
            </h4>
            <p style={{ color: '#4d6d82', fontSize: '0.95rem' }}>
              <span className="lang-en">Mon–Sat: 9:00 AM – 6:00 PM</span>
              <span className="lang-hi">सोम–शनि: सुबह 9 – शाम 6</span>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN – Form */}
        <div>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: '#0a3142' }}>
            <span className="lang-en">Send us a message</span>
            <span className="lang-hi">हमें संदेश भेजें</span>
          </h3>

          {submitted && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.8rem', borderRadius: '0.8rem', marginBottom: '1.2rem' }}>
              ✅ {lang === 'en' ? 'Message sent successfully!' : 'संदेश सफलतापूर्वक भेजा गया!'}
            </div>
          )}
          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '0.8rem', borderRadius: '0.8rem', marginBottom: '1.2rem' }}>
              ⚠️ {lang === 'en' ? 'Something went wrong. Please try again.' : 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।'}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  fontWeight: 600,
                  marginBottom: '0.3rem',
                  color: '#1b4155',
                  fontSize: '0.9rem',
                }}>
                  <span className="lang-en">First Name</span>
                  <span className="lang-hi">पहला नाम</span>
                  <span style={{ color: '#d32f2f', marginLeft: '0px' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={lang === 'en' ? 'Your first name' : 'आपका पहला नाम'}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#f9fbfd' }}
                />
              </div>
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  fontWeight: 600,
                  marginBottom: '0.3rem',
                  color: '#1b4155',
                  fontSize: '0.9rem',
                }}>
                  <span className="lang-en">Last Name</span>
                  <span className="lang-hi">अंतिम नाम</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder={lang === 'en' ? 'Your last name' : 'आपका अंतिम नाम'}
                  value={formData.last_name}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#f9fbfd' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontWeight: 600,
                marginBottom: '0.3rem',
                color: '#1b4155',
                fontSize: '0.9rem',
              }}>
                <span className="lang-en">Email</span>
                <span className="lang-hi">ईमेल</span>
                <span style={{ color: '#d32f2f', marginLeft: '0px' }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#f9fbfd' }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontWeight: 600,
                marginBottom: '0.3rem',
                color: '#1b4155',
                fontSize: '0.9rem',
              }}>
                <span className="lang-en">Phone</span>
                <span className="lang-hi">फोन</span>
                <span style={{ color: '#d32f2f', marginLeft: '0px' }}>*</span>  {/* 👈 added asterisk */}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                required   // 👈 added required attribute
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '40px', border: '1px solid #d0dce6', fontSize: '1rem', background: '#f9fbfd' }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                fontWeight: 600,
                marginBottom: '0.3rem',
                color: '#1b4155',
                fontSize: '0.9rem',
              }}>
                <span className="lang-en">Message</span>
                <span className="lang-hi">संदेश</span>
                <span style={{ color: '#d32f2f', marginLeft: '0px' }}>*</span>
              </label>
              <textarea
                name="message"
                rows="4"
                placeholder={lang === 'en' ? 'How can we help you?' : 'हम आपकी कैसे मदद कर सकते हैं?'}
                value={formData.message}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '1rem', border: '1px solid #d0dce6', fontSize: '1rem', background: '#f9fbfd', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn"
              style={{
                marginTop: '1.5rem',
                background: '#0a3142',
                color: '#fff',
                padding: '0.8rem 2.5rem',
                borderRadius: '40px',
                border: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: '0.2s',
              }}
              onMouseEnter={(e) => e.target.style.background = '#1e4f68'}
              onMouseLeave={(e) => e.target.style.background = '#0a3142'}
            >
              {t('contactFormSend')}
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
};

export default ContactPage;