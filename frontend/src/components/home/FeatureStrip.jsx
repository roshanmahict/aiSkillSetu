import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const FeatureStrip = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang]?.[key] || key;

  console.log('🔍 verifiedWorkers =', t('verifiedWorkers'));
  console.log('🔍 aadhaarAuth =', t('aadhaarAuth'));

  return (
    <div className="feature-strip">
      <div className="feature-card">
        <i className="fas fa-id-card"></i>
        <h4>{t('verifiedWorkers')}</h4>
        <p>{t('aadhaarAuth')}</p>
      </div>
      <div className="feature-card">
        <i className="fas fa-shield-alt"></i>
        <h4>{t('zeroFraud')}</h4>
        <p>{t('securePayments')}</p>
      </div>
      <div className="feature-card">
        <i className="fas fa-users"></i>
        <h4>{t('scalable')}</h4>
        <p>{t('oneToHundred')}</p>
      </div>
      <div className="feature-card">
        <i className="fas fa-clock"></i>
        <h4>{t('timelySupport')}</h4>
        <p>{t('support247')}</p>
      </div>
    </div>
  );
};

export default FeatureStrip;