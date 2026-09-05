import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const { user } = useAuth();

  const whatsappNumber = '6205386407'; // your contact number
  const whatsappMessage = encodeURIComponent('Hi, I am interested in your services. Please contact me.');

  return (
    <section className="hero">
      <div className="container inner">
        <div className="hero-content">
          <div className="eyebrow">{t('platformTagline')}</div>
          <h1>{t('heroTitle')}</h1>
          <p className="lead">{t('heroLead')}</p>
          <p>{t('heroFeatures')}</p>
          <div className="hero-buttons">
            <Link to="/services" className="btn-primary">{t('viewServices')}</Link>
            {!user && <Link to="/login" className="btn-secondary">{t('getStarted')}</Link>}
          </div>
        </div>

        {user ? (
          // Logged in – welcome message with WhatsApp
          <div className="login-card" style={{ borderColor: '#f39c12', gridColumn: 'span 2' }}>
            <h3><i className="fas fa-hand-wave"></i> Welcome back, {user.first_name}!</h3>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>We will contact you soon with the best opportunities.</p>
            <p style={{ fontSize: '0.95rem', marginBottom: '1.2rem', color: '#f5d99b' }}>
              <i className="fas fa-phone-alt" style={{ marginRight: '0.5rem' }}></i>
              Need immediate assistance? Reach us on WhatsApp.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/profile" className="btn-primary" style={{ background: '#f39c12', color: '#0a3142' }}>
                <i className="fas fa-user"></i> My Profile
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: '#25D366', color: '#fff' }}
              >
                <i className="fab fa-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
        ) : (
          // Logged out – login cards (same as before)
          <>
            <div className="login-card helper-card">
              <h3><i className="fas fa-user-tie"></i> {t('needHelper')}</h3>
              <p>{t('helperDesc')}</p>
              <Link to="/login" className="btn-primary">{t('loginCompany')}</Link>
              <div style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                <span className="lang-en">New contractor?</span>
                <span className="lang-hi">नए ठेकेदार?</span>{' '}
                <Link to="/signup/contractor" style={{ color: '#f39c12', fontWeight: 700 }}>
                  <span className="lang-en">Sign up here</span>
                  <span className="lang-hi">यहाँ पंजीकरण करें</span>
                </Link>
              </div>
            </div>
            <div className="login-card labour-card">
              <h3><i className="fas fa-user-hard-hat"></i> {t('lookingWork')}</h3>
              <p>{t('labourDesc')}</p>
              <Link to="/login" className="btn-primary">{t('loginLabour')}</Link>
              <div style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
                <span className="lang-en">New worker?</span>
                <span className="lang-hi">नए श्रमिक?</span>{' '}
                <Link to="/signup/worker" style={{ color: '#f39c12', fontWeight: 700 }}>
                  <span className="lang-en">Sign up here</span>
                  <span className="lang-hi">यहाँ पंजीकरण करें</span>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Hero;