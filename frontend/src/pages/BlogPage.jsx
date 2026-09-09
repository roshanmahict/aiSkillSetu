import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/blog/');
        setPosts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts.');
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading posts...</div>;
  if (error) return <div className="container" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#0a3142' }}>Our Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts yet. Check back soon!</p>
      ) : (
        posts.map((post) => (
          <article key={post.id} style={{ borderBottom: '1px solid #edf0f3', padding: '2rem 0' }}>
            {post.featured_image_url && (
              <img 
                src={post.featured_image_url} 
                alt={post.title} 
                style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '12px' }} 
              />
            )}
            <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
              <h2 style={{ color: '#0a3142', margin: '1rem 0 0.5rem' }}>{post.title}</h2>
            </Link>
            <p style={{ color: '#4d6d82' }}>{post.excerpt}</p>
            {/* ✅ Fixed: Safe substring with fallback */}
            {post.content && (
              <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 200) + '...' }} />
            )}
            <Link to={`/blog/${post.slug}`} style={{ color: '#f39c12', fontWeight: 600 }}>Read More →</Link>
          </article>
        ))
      )}
    </div>
  );
};

export default BlogPage;