import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../utils/translations';

const FAQPage = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: 'faq1Q', a: 'faq1A' },
    { q: 'faq2Q', a: 'faq2A' },
    { q: 'faq3Q', a: 'faq3A' },
    { q: 'faq4Q', a: 'faq4A' },
    { q: 'faq5Q', a: 'faq5A' },
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container" style={{ padding: '3rem 0', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="section-title">{t('faqTitle')}</h2>
      <p className="section-sub">{t('faqSub')}</p>

      <div className="faq-list">
        {faqs.map((faq, idx) => (
          <div key={idx} className="faq-item" style={{ background: '#fff', border: '1px solid #edf0f3', borderRadius: '1rem', marginBottom: '0.8rem', overflow: 'hidden' }}>
            <div
              className="faq-question"
              onClick={() => toggle(idx)}
              style={{ padding: '1rem 1.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s' }}
            >
              <span>{t(faq.q)}</span>
              <i className={`fas fa-chevron-${openIndex === idx ? 'up' : 'down'}`} style={{ transition: '0.3s' }}></i>
            </div>
            {openIndex === idx && (
              <div className="faq-answer" style={{ padding: '0 1.5rem 1.5rem', color: '#4d6d82' }}>
                {t(faq.a)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;