import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMenu } from '../../hooks/useMenu';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const RenderMenuItem = ({ item, lang, toggleLanguage, t }) => {
  const { title, link, children, icon } = item;

  if (children && children.length > 0) {
    return (
      <div className="nav-item">
        <NavLink to={link}>
          {icon && <i className={icon}></i>} {t(title)}
          <i className="fas fa-chevron-down"></i>
        </NavLink>
        <div className="dropdown-menu">
          {children.map((child) => (
            <RenderMenuItem key={child.id} item={child} lang={lang} toggleLanguage={toggleLanguage} t={t} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <NavLink to={link} className={({ isActive }) => (isActive ? 'active' : '')}>
      {icon && <i className={icon}></i>} {t(title)}
    </NavLink>
  );
};

const Navbar = () => {
  const { menu, loading: menuLoading, error } = useMenu();
  const { lang, toggleLanguage } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const { user, logout } = useAuth();   // 👈 from context
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  if (menuLoading) return <nav>Loading menu...</nav>;
  if (error) return <nav>Error loading menu</nav>;

  return (
    <header>
      <div className="logo">
        <img src={logo} alt="AI Skill Setu Logo" />
        <div>
          <div className="logo-text">AI <span>SKILL</span> SETU</div>
          <span className="logo-sub">{t('tagline')}</span>
        </div>
      </div>

      <button className="hamburger" onClick={toggleMobile}>
        <i className={`fas fa-${mobileOpen ? 'times' : 'bars'}`}></i>
      </button>

      <nav className={mobileOpen ? 'open' : ''}>
        {menu.map((item) => (
          <RenderMenuItem key={item.id} item={item} lang={lang} toggleLanguage={toggleLanguage} t={t} />
        ))}

        {user ? (
          // Logged in – show profile + logout
          <>
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
              <i className="fas fa-user-circle"></i> {user.first_name || 'Profile'}
            </NavLink>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#2a4a5a',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0.3rem 0',
                fontSize: '0.95rem',
              }}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </>
        ) : (
          // Logged out – show signup + login
          <>
            <NavLink to="/signup/worker" className="nav-cta" style={{ background: '#f39c12', color: '#0a3142' }}>
              <i className="fas fa-user-plus"></i> Worker Signup
            </NavLink>
            <NavLink to="/signup/contractor" className="nav-cta">
              <i className="fas fa-building"></i> Contractor Signup
            </NavLink>
            <NavLink to="/login" className="nav-cta">
              <i className="fas fa-sign-in-alt"></i> {t('login')}
            </NavLink>
          </>
        )}

        <span className="separator">|</span>
        <div className="nav-lang">
          <button className={lang === 'en' ? 'active' : ''} onClick={() => toggleLanguage('en')}>EN</button>
          <button className={lang === 'hi' ? 'active' : ''} onClick={() => toggleLanguage('hi')}>हि</button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;