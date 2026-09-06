import { useState, useEffect } from 'react';
import axios from 'axios';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState({ head_html: '', body_end_html: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('http://127.0.0/api/site-settings/');
        setSettings(res.data);
      } catch (err) {
        console.warn('Failed to load site settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return { settings, loading };
};