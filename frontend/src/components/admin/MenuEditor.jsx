import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MenuEditor = () => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('/api/menu/');
      setMenu(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const updateItem = async (id, field, value) => {
    try {
      await axios.patch(`/api/menu/${id}/`, { [field]: value });
      // Update local state optimistically
      setMenu(prev => prev.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      }));
    } catch (err) {
      console.error('Update failed', err);
      // Revert? We'll just refetch on error
      fetchMenu();
    }
  };

  const renderMenuItem = (item, level = 0) => {
    const indent = level * 20;
    return (
      <div key={item.id} style={{ marginLeft: indent, padding: '8px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Title */}
          <input
            value={item.title}
            onChange={e => updateItem(item.id, 'title', e.target.value)}
            onBlur={() => { /* save on blur */ }}
            style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {/* Link */}
          <input
            value={item.link}
            onChange={e => updateItem(item.id, 'link', e.target.value)}
            style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          {/* Icon */}
          <input
            value={item.icon || ''}
            onChange={e => updateItem(item.id, 'icon', e.target.value)}
            placeholder="icon class"
            style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
          />
          {/* Active */}
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={item.is_active !== undefined ? item.is_active : true}
              onChange={e => updateItem(item.id, 'is_active', e.target.checked)}
            /> Active
          </label>
          {/* Add child button */}
          <button
            onClick={() => {
              const newItem = {
                title: 'New Child',
                link: '/',
                parent: item.id,
                order: (item.children ? item.children.length : 0),
              };
              axios.post('/api/menu/', newItem).then(() => fetchMenu());
            }}
          >
            + Child
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this item?')) {
                axios.delete(`/api/menu/${item.id}/`).then(() => fetchMenu());
              }
            }}
            style={{ color: 'red' }}
          >
            Delete
          </button>
        </div>
        {/* Children */}
        {item.children && item.children.length > 0 && (
          <div>
            {item.children.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Menu Editor</h2>
      <button onClick={() => {
        const newItem = {
          title: 'New Item',
          link: '/',
          order: menu.length,
        };
        axios.post('/api/menu/', newItem).then(() => fetchMenu());
      }} style={{ marginBottom: '20px' }}>
        + Add Top Level Item
      </button>
      {menu.map(item => renderMenuItem(item))}
    </div>
  );
};

export default MenuEditor;