import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DynamicPage = () => {
  const { slug } = useParams();
  const cleanSlug = slug?.toLowerCase() || '';
  
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8001/api/page-content/${cleanSlug}/`);
        setPageData(res.data);
        setError('');
      } catch {
        setError('Page content not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [cleanSlug]);

  const pageTitle = pageData?.title || cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (loading) {
    return (
      <div style={pageStyles.loaderContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading page...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyles.errorContainer}>
        <h2>📍 Page Not Found</h2>
        <p>{error}</p>
        <Link to="/" style={pageStyles.backButton}>Go Back Home</Link>
      </div>
    );
  }

  const getImageUrl = (image) => {
    if (!image) return null;
    return image.startsWith('http') ? image : `http://127.0.0.1:8001/media/${image}`;
  };
  return (
    <div style={pageStyles.container}>
      {/* Hero Section */}
      <div class="herosection" style={{
        ...pageStyles.hero,
        backgroundImage: pageData?.image 
          ? `url(${getImageUrl(pageData.image)})` 
          : pageStyles.hero.background,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(10,49,66,0.85)',
      }}>
        <div style={pageStyles.heroContent}>
          {/* ✅ HEADING */}
          <h1 style={pageStyles.heroTitle}>{pageData?.title || pageTitle}</h1>

          {/* ✅ SUBTITLE – NEW! */}
          {pageData?.subtitle && (
            <p class="subheading" style={pageStyles.heroSubtitle}>{pageData.subtitle}</p>
          )}

          {/* Optional Image */}
          {pageData?.image && (
            <img 
              src={`http://127.0.0.1:8001/media/${pageData.image}`} 
              alt={pageData.title} 
              style={pageStyles.heroImage}
            />
          )}

          {/* Optional Description Preview (if you want to keep it) */}
          {pageData?.content && (
            <div 
              style={pageStyles.heroDescription}
              dangerouslySetInnerHTML={{ __html: pageData.content.substring(0, 150) + '...' }}
            />
          )}
        </div>
      </div>

      {/* Main Content Card */}
      <div style={pageStyles.contentWrapper}>
        <div style={pageStyles.contentCard}>
          <div 
            style={pageStyles.richContent}
            dangerouslySetInnerHTML={{ __html: pageData?.content || '<p>Content coming soon...</p>' }}
          />
          <hr style={pageStyles.divider} />
          <Link to="/" style={pageStyles.backButton}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

// Make sure you have pageStyles imported
const pageStyles = {
  container: { minHeight: '100vh', background: '#f8fafc' },
  loaderContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#0a3142' },
  spinner: { width: '50px', height: '50px', border: '5px solid #e0e7ef', borderTop: '5px solid #0a3142', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  errorContainer: { textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', color: '#c62828' },
  hero: { background: 'linear-gradient(135deg, #0a3142 0%, #1a4a5e 100%)', padding: '4rem 2rem', textAlign: 'center', borderBottom: '4px solid #f39c12' },
  heroContent: { maxWidth: '800px', margin: '0 auto' },
  heroTitle: { fontSize: '3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  heroSubtitle: { fontSize: '1.3rem', color: '#b0c9d9', marginBottom: '0.5rem', lineHeight: '1.6' },  // ✅ NEW STYLE
  heroImage: { maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '1rem', border: '2px solid rgba(255,255,255,0.2)' },
  heroDescription: { fontSize: '1.1rem', color: '#b0c9d9', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' },
  contentWrapper: { maxWidth: '1200px', margin: '-2rem auto 3rem auto', padding: '0 1.5rem' },
  contentCard: { background: '#ffffff', borderRadius: '1.5rem', padding: '2.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid #edf0f3' },
  richContent: { fontSize: '1.1rem', lineHeight: '1.9', color: '#1b4155', fontFamily: '"Inter", system-ui, sans-serif' },
  divider: { margin: '2rem 0', border: 'none', borderTop: '2px dashed #e0e7ef' },
  backButton: { display: 'inline-block', padding: '0.7rem 1.8rem', background: '#0a3142', color: '#ffffff', borderRadius: '40px', textDecoration: 'none', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '1rem' },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleSheet);

export default DynamicPage;