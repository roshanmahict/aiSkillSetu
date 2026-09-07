import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMenu = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('/api/menu/');
        // ✅ Ensure menu is always an array
        const data = response.data;
        setMenu(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return { menu, loading, error };
};