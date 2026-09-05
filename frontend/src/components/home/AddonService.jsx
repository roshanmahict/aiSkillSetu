import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const AddonService = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;

  return (
    <div className="addon-card">
      <h3><i className="fas fa-users-cog"></i> {t('addonService')}</h3>
      <p><strong>{t('bookTeam')}</strong><br />{t('bookTeamDesc')}</p>
      <Link to="/contact" className="btn">{t('contactTeamBooking')}</Link>
    </div>
  );
};

export default AddonService;