import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const TopBar = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;

  return (
    <div className="topbar">
      <div className="container inner">
        <div className="copy">
          <strong>{t('lookingLabour') || 'Looking for verified labour?'}</strong>
          <span>{t('postProjectDesc') || 'Post your project and get connected with Aadhaar-verified workers in Jharkhand.'}</span>
        </div>
        <div className="filter-chips">
          {/* chips will be dynamic, but we can keep static for now */}
          <span className="chip"><i className="fas fa-hard-hat"></i> Mason</span>
          <span className="chip"><i className="fas fa-hammer"></i> Carpenter</span>
          <span className="chip"><i className="fas fa-paint-roller"></i> Painter</span>
          <span className="chip"><i className="fas fa-bolt"></i> Electrician</span>
          <span className="chip"><i className="fas fa-wrench"></i> Plumber</span>
          <span className="chip"><i className="fas fa-users"></i> Labour</span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;