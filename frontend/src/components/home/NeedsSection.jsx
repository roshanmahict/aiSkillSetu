import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const NeedsSection = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;

  return (
    <section className="needs-section">
      <div className="container">
        <h2 className="section-title">{t('forBusiness')} & {t('forPersonal')}</h2>
        <p className="section-sub">{t('needsBusinessDesc')}</p>
        <div className="needs-grid">
          <div className="needs-card">
            <i className="fas fa-building"></i>
            <h3>{t('forBusiness')}</h3>
            <p style={{ color: '#4d6d82', fontSize: '0.95rem' }}>
              {t('needsBusinessDesc')}
            </p>
            <ul>
              <li><i className="fas fa-check-circle"></i> {t('bulkHiring')}</li>
              <li><i className="fas fa-check-circle"></i> {t('dedicatedManager')}</li>
              <li><i className="fas fa-check-circle"></i> {t('customTimelines')}</li>
              <li><i className="fas fa-check-circle"></i> {t('prioritySupport')}</li>
            </ul>
            <Link to="/login" className="btn-sm">{t('getQuote')}</Link>
          </div>
          <div className="needs-card">
            <i className="fas fa-home"></i>
            <h3>{t('forPersonal')}</h3>
            <p style={{ color: '#4d6d82', fontSize: '0.95rem' }}>
              {t('needsPersonalDesc')}
            </p>
            <ul>
              <li><i className="fas fa-check-circle"></i> {t('singleWorker')}</li>
              <li><i className="fas fa-check-circle"></i> {t('flexiblePayment')}</li>
              <li><i className="fas fa-check-circle"></i> {t('quickBooking')}</li>
              <li><i className="fas fa-check-circle"></i> {t('verifiedGuarantee')}</li>
            </ul>
            <Link to="/login" className="btn-sm">{t('bookHome')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeedsSection;