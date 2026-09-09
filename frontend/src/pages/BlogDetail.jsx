import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { pageStyles } from '../styles/pageStyles';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/blog/${slug}/`);
        setPost(res.data);
        setError('');
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Blog post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div style={pageStyles.loaderContainer}>
        <div style={pageStyles.spinner}></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyles.errorContainer}>
        <h2>📍 Post Not Found</h2>
        <p>{error}</p>
        <Link to="/" style={pageStyles.backButton}>Go Back Home</Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={pageStyles.errorContainer}>
        <h2>📍 Post Not Found</h2>
        <p>This post does not exist.</p>
        <Link to="/" style={pageStyles.backButton}>Go Back Home</Link>
      </div>
    );
  }

  return (
    <div style={pageStyles.container}>
      {/* Hero Section */}
      <div style={pageStyles.hero}>
        <div style={pageStyles.heroContent}>
          <h1 style={pageStyles.heroTitle}>{post.title}</h1>
          <p style={pageStyles.heroSubtitle}>
            By {post.author_name || post.author?.first_name || 'Admin'} • {post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date not available'}
          </p>
          {post.category_name && (
            <span style={{ background: '#f39c12', padding: '0.3rem 1.2rem', borderRadius: '30px', display: 'inline-block', color: '#0a3142', fontWeight: 600 }}>
              {post.category_name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={pageStyles.contentWrapper}>
        <div style={pageStyles.contentCard}>
          {post.featured_image && (
            <img 
              src={post.featured_image} 
              alt={post.title} 
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '1rem', marginBottom: '2rem' }}
            />
          )}
          <div 
            style={pageStyles.richContent}
            dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
          />
          <hr style={pageStyles.divider} />
          <Link to="/blog" style={pageStyles.backButton}>← Back to Blog</Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;