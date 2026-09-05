import React, { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const SiteInjector = () => {
  const { settings } = useSiteSettings();

  // Inject into <head>
  useEffect(() => {
    if (settings.head_html) {
      const div = document.createElement('div');
      div.innerHTML = settings.head_html;
      
      // Move all child nodes (script, link, meta, style) to the head
      while (div.firstChild) {
        const node = div.firstChild;
        // If it's a script, we need to re-create it to make it executable
        if (node.tagName === 'SCRIPT') {
          const script = document.createElement('script');
          // Copy all attributes
          [...node.attributes].forEach(attr => script.setAttribute(attr.name, attr.value));
          script.textContent = node.textContent;
          document.head.appendChild(script);
        } else {
          document.head.appendChild(node);
        }
      }
    }
  }, [settings.head_html]);

  // Inject after the footer (bottom of body)
  useEffect(() => {
    if (settings.body_end_html) {
      const div = document.createElement('div');
      div.innerHTML = settings.body_end_html;
      
      while (div.firstChild) {
        const node = div.firstChild;
        if (node.tagName === 'SCRIPT') {
          const script = document.createElement('script');
          [...node.attributes].forEach(attr => script.setAttribute(attr.name, attr.value));
          script.textContent = node.textContent;
          document.body.appendChild(script);
        } else {
          document.body.appendChild(node);
        }
      }
    }
  }, [settings.body_end_html]);

  // This component renders nothing visible
  return null;
};

export default SiteInjector;