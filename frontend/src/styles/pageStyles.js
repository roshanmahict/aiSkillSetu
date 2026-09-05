export const pageStyles = {
  // Container
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
  },

  // Hero Section
  hero: {
    background: 'linear-gradient(135deg, #0a3142 0%, #1a4a5e 100%)',
    padding: '4rem 2rem',
    textAlign: 'center',
    borderBottom: '4px solid #f39c12',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: '0.5rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#b0c9d9',
  },
  heroImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '1rem',
    marginBottom: '1rem',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: '#b0c9d9',
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto',
  },

  // Content Card
  contentWrapper: {
    maxWidth: '1200px',
    margin: '-2rem auto 3rem auto',
    padding: '0 1.5rem',
  },
  contentCard: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    border: '1px solid #edf0f3',
  },
  richContent: {
    fontSize: '1.1rem',
    lineHeight: '1.9',
    color: '#1b4155',
    fontFamily: '"Inter", system-ui, sans-serif',
  },
  divider: {
    margin: '2rem 0',
    border: 'none',
    borderTop: '2px dashed #e0e7ef',
  },

  // Buttons
  backButton: {
    display: 'inline-block',
    padding: '0.7rem 1.8rem',
    background: '#0a3142',
    color: '#ffffff',
    borderRadius: '40px',
    textDecoration: 'none',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
  },

  // Loader
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#0a3142',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e0e7ef',
    borderTop: '5px solid #0a3142',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
    maxWidth: '600px',
    margin: '0 auto',
    color: '#c62828',
  },
};

// Inject spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);