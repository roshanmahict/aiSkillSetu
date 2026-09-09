import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container} className="footer-container">
        {/* Brand Section */}
        <div style={styles.brandSection} className="footer-brand">
          <div style={styles.logoWrapper} className="footer-logo-wrapper">
            <img src={logo} alt="AI Skill Setu" style={styles.logo} />
            <div>
              <div style={styles.logoText}>AI <span style={styles.logoAccent}>SKILL</span> SETU</div>
              <div style={styles.logoSub}>Connecting Skills, Building Dreams</div>
            </div>
          </div>
          <p style={styles.brandDesc} className="footer-brand-desc">
            Empowering Jharkhand's workforce by connecting skilled workers with employers through a transparent, secure, and efficient platform.
          </p>
        </div>

        {/* Quick Links */}
        <div style={styles.linkSection}>
          <h4 style={styles.heading}>Quick Links</h4>
          <Link to="/" style={styles.link} className="footer-link">Home</Link>
          <Link to="/services" style={styles.link} className="footer-link">Services</Link>
          <Link to="/about" style={styles.link} className="footer-link">About Us</Link>
          <Link to="/locations" style={styles.link} className="footer-link">Locations</Link>
          <Link to="/contact" style={styles.link} className="footer-link">Contact</Link>
          <Link to="/faq" style={styles.link} className="footer-link">FAQ</Link>
        </div>

        {/* For Workers */}
        <div style={styles.linkSection}>
          <h4 style={styles.heading}>For Workers</h4>
          <Link to="/signup/worker" style={styles.link} className="footer-link">Worker Signup</Link>
          <Link to="/login" style={styles.link} className="footer-link">Worker Login</Link>
          <Link to="/find-labour" style={styles.link} className="footer-link">Find Projects</Link>
        </div>

        {/* Contact */}
        <div style={styles.linkSection}>
          <h4 style={styles.heading}>Contact</h4>
          <div style={styles.contactItem} className="footer-contact-item">
            <i className="fas fa-phone" style={styles.contactIcon}></i>
            <span>+91 62053 86407</span>
          </div>
          <div style={styles.contactItem} className="footer-contact-item">
            <i className="fas fa-envelope" style={styles.contactIcon}></i>
            <span>info@aiskillsetu.com</span>
          </div>
          <div style={styles.contactItem} className="footer-contact-item">
            <i className="fas fa-map-marker-alt" style={styles.contactIcon}></i>
            <span>Jharkhand, India</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomContainer} className="footer-bottom-container">
          <span>© 2026 <strong style={styles.brandStrong}>Anita Labour Service</strong>. All rights reserved.</span>
          <div style={styles.socialLinks} className="footer-social-links">
            <a href="#" style={styles.socialIcon} className="footer-social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" style={styles.socialIcon} className="footer-social"><i className="fab fa-twitter"></i></a>
            <a href="#" style={styles.socialIcon} className="footer-social"><i className="fab fa-instagram"></i></a>
            <a href="#" style={styles.socialIcon} className="footer-social"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ------------------- Styles -------------------
const styles = {
  footer: {
    background: '#0a3142',
    color: '#b0d0e0',
    padding: '3rem 1.5rem 0',
    marginTop: '2rem',
    borderTop: '4px solid #f39c12',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
    gap: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  logo: {
    height: '50px',
    width: 'auto',
    borderRadius: '8px',
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  logoAccent: {
    color: '#f39c12',
  },
  logoSub: {
    fontSize: '0.75rem',
    color: '#b0d0e0',
    letterSpacing: '0.5px',
  },
  brandDesc: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#b0d0e0',
    maxWidth: '350px',
    margin: 0,
  },
  linkSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  heading: {
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
    letterSpacing: '0.3px',
  },
  link: {
    color: '#b0d0e0',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
    padding: '0.2rem 0',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.95rem',
    color: '#b0d0e0',
    padding: '0.2rem 0',
  },
  contactIcon: {
    color: '#f39c12',
    width: '1.2rem',
    textAlign: 'center',
    fontSize: '0.9rem',
  },
  bottomBar: {
    background: 'rgba(0,0,0,0.15)',
    padding: '1rem 1.5rem',
    marginTop: '0',
  },
  bottomContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    fontSize: '0.9rem',
    color: '#b0d0e0',
  },
  brandStrong: {
    color: '#f39c12',
    fontWeight: 700,
  },
  socialLinks: {
    display: 'flex',
    gap: '0.8rem',
  },
  socialIcon: {
    color: '#b0d0e0',
    fontSize: '1.1rem',
    transition: 'color 0.2s',
    textDecoration: 'none',
  },
};

// ✅ Inject CSS for responsive behavior
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .footer-link:hover { color: #f39c12 !important; }
  .footer-social:hover { color: #f39c12 !important; }
  
  /* ===== Responsive: Tablet ===== */
  @media (max-width: 1024px) {
    .footer-container {
      grid-template-columns: 1fr 1fr !important;
      gap: 2rem !important;
    }
  }
  
  /* ===== Responsive: Mobile ===== */
  @media (max-width: 768px) {
    .footer-container {
      grid-template-columns: 1fr !important;
      gap: 1.5rem !important;
      text-align: center !important;
    }
    .footer-brand-desc {
      max-width: 100% !important;
      text-align: center !important;
    }
    .footer-logo-wrapper {
      justify-content: center !important;
    }
    .footer-bottom-container {
      flex-direction: column !important;
      text-align: center !important;
    }
    .footer-social-links {
      justify-content: center !important;
    }
    .footer-contact-item {
      justify-content: center !important;
    }
    .footer-brand {
      align-items: center !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default Footer;