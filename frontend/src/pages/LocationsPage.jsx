import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LocationsPage = () => {
  const { slug } = useParams();
  const cleanSlug = slug.toLowerCase() || ''; // <-- Safe fallback

  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8001/api/page-content/${cleanSlug}/`);
        setPageData(res.data);
        setError('');
      } catch (err) {
        setError('Location details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [cleanSlug]);

  const locationName = cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1);

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p>Loading location details...</p>
      </div>
    );
  }

  // ========== ERROR STATE ==========
  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>📍 Location Not Found</h2>
        <p>{error}</p>
        <Link to="/" style={styles.backButton}>Go Back Home</Link>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{pageData?.title || locationName}</h1>
          <p style={styles.heroSubtitle}>
            Home / <span style={{ color: '#f39c12' }}>Areas We Serve</span> / {locationName}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        <div style={styles.contentCard}>
          {pageData?.image && (
            <img 
              src={`http://127.0.0.1:8001/media/${pageData.image}`} 
              alt={pageData.title} 
              style={styles.featuredImage}
            />
          )}

          <div 
            style={styles.richContent}
            dangerouslySetInnerHTML={{ __html: pageData?.content || `<p>Welcome to ${locationName}. We provide top-notch labour and project services here.</p>` }}
          />

          <hr style={styles.divider} />

          <div style={styles.whySection}>
            <h3 style={styles.whyTitle}>🌟 Why Choose {locationName}?</h3>
            <div style={styles.featureGrid}>
              <div style={styles.featureItem}><span style={styles.featureIcon}>✅</span> Verified Local Workers</div>
              <div style={styles.featureItem}><span style={styles.featureIcon}>💰</span> Competitive Daily Rates</div>
              <div style={styles.featureItem}><span style={styles.featureIcon}>🛡️</span> Secure & Transparent Payments</div>
              <div style={styles.featureItem}><span style={styles.featureIcon}>📞</span> 24/7 Local Support</div>
            </div>
          </div>

          <Link to="/" style={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// ------------------- Styling -------------------
const styles = {
  container: { minHeight: '100vh', background: '#f8fafc' },
  loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#0a3142' },
  spinner: { width: '50px', height: '50px', border: '5px solid #e0e7ef', borderTop: '5px solid #0a3142', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  errorContainer: { textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', color: '#c62828' },
  hero: { 
    background: 'linear-gradient(135deg, #0a3142 0%, #1a4a5e 100%)', 
    padding: '4rem 2rem', 
    textAlign: 'center', 
    borderBottom: '4px solid #f39c12' 
  },
  heroContent: { maxWidth: '800px', margin: '0 auto' },
  heroTitle: { fontSize: '3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  heroSubtitle: { fontSize: '1.1rem', color: '#b0c9d9' },
  contentWrapper: { maxWidth: '1200px', margin: '-2rem auto 3rem auto', padding: '0 1.5rem' },
  contentCard: { background: '#ffffff', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #edf0f3' },
  featuredImage: { width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem', border: '1px solid #e0e7ef' },
  richContent: { fontSize: '1.1rem', lineHeight: '1.9', color: '#1b4155', fontFamily: '"Inter", system-ui, sans-serif' },
  divider: { margin: '2rem 0', border: 'none', borderTop: '2px dashed #e0e7ef' },
  whySection: { background: '#f1f6fa', padding: '1.5rem 2rem', borderRadius: '1rem', marginBottom: '2rem' },
  whyTitle: { fontSize: '1.3rem', fontWeight: 600, color: '#0a3142', marginBottom: '1rem' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#1b4155' },
  featureIcon: { fontSize: '1.3rem' },
  backButton: { display: 'inline-block', padding: '0.7rem 1.8rem', background: '#0a3142', color: '#ffffff', borderRadius: '40px', textDecoration: 'none', fontWeight: 600, transition: '0.2s', border: 'none', cursor: 'pointer', marginTop: '1rem' },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default LocationsPage;