import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

const SearchBar = ({ onSearch }) => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const [trade, setTrade] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ trade, location });
  };

  return (
    <section className="search-section">
      <div className="container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-fields">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
            />
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">{t('allLocations')}</option>
              <option value="ranchi">Ranchi</option>
              <option value="jamshedpur">Jamshedpur</option>
              <option value="dhanbad">Dhanbad</option>
              <option value="bokaro">Bokaro</option>
              {/* Add more */}
            </select>
          </div>
          <button type="submit" className="search-btn">{t('findLabour')}</button>
          <span className="divider"></span>
          <Link to="/post-project" className="post-btn">{t('postProject')}</Link>
        </form>
      </div>
    </section>
  );
};

export default SearchBar;