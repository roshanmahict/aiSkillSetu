import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const SafetySection = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;

  const items = [
    { icon: 'fa-id-card', label: 'aadhaarVerified', desc: 'safetyAadhaar' },
    { icon: 'fa-shield-alt', label: 'securePayments', desc: 'safetyPayments' }, // note: key 'securePayments' already exists
    { icon: 'fa-bus', label: 'travelAssistance', desc: 'safetyTravel' },
    { icon: 'fa-headset', label: 'support247label', desc: 'safetySupport' },
    { icon: 'fa-file-invoice', label: 'insuranceCoverage', desc: 'safetyInsurance' },
    { icon: 'fa-ban', label: 'zeroFraudGuarantee', desc: 'safetyZeroFraud' },
  ];

  return (
    <section className="safety-section">
      <div className="container">
        <h2 className="section-title">{t('safetyPriority')}</h2>
        <p className="section-sub">{t('safetyDesc')}</p>
        <div className="safety-grid">
          {items.map((item, idx) => (
            <div className="safety-item" key={idx}>
              <i className={`fas ${item.icon}`}></i>
              <h4>{t(item.label)}</h4>
              <p>{t(item.desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafetySection;