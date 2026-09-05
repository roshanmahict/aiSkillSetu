import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';
import { translations } from '../../utils/translations';

// Static project data (replace with API call later)
const staticProjects = [
  {
    id: 1,
    company_name: 'ABC Constructions',
    district: 'Ranchi',
    trade: 'Mason',
    start_date: '5 Sep 2026',
    required_count: 6,
    hired_count: 2,
    daily_wage: 550,
    verified: true,
  },
  {
    id: 2,
    company_name: 'Sahu Builders',
    district: 'Jamshedpur',
    trade: 'Carpenter',
    start_date: '8 Sep 2026',
    required_count: 4,
    hired_count: 2,
    daily_wage: 480,
    verified: true,
  },
  {
    id: 3,
    company_name: 'Vikram Developers',
    district: 'Dhanbad',
    trade: 'Electrician',
    start_date: '10 Sep 2026',
    required_count: 3,
    hired_count: 0,
    daily_wage: 620,
    verified: true,
  },
];

const ProjectsSection = () => {
  const { lang } = useLanguage();
  const t = (key) => translations[lang][key] || key;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with actual API call:
    // fetch('/api/projects/nearby/?lat=23.3441&lng=85.3096&radius=20')
    //   .then(res => res.json())
    //   .then(data => { setProjects(data); setLoading(false); })
    //   .catch(err => { console.error(err); setLoading(false); });

    // Using static data for now
    setProjects(staticProjects);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="projects-section">
        <div className="container">
          <h2 className="section-title">{t('recentProjects')}</h2>
          <p style={{ textAlign: 'center' }}>Loading projects...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="projects-section">
      <div className="container">
        <h2 className="section-title">{t('recentProjects')}</h2>
<p className="section-sub">{t('recentSub')}</p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card" key={project.id}>
              {/* Card Header */}
              <div className="card-header">
                <span className="poster">
                  <i className="fas fa-user-circle"></i> {project.company_name}
                </span>
                {project.verified && (
                  <span className="badge-verified">
                    <i className="fas fa-check-circle"></i> {t('verified')}
                  </span>
                )}
              </div>

              {/* Location Badge */}
              <div className="route-badge">
                <i className="fas fa-map-pin"></i> {project.district}
              </div>

              {/* Project Details Grid */}
              <div className="project-details">
                <div>
                  <i className="fas fa-user-tie"></i>{' '}
                  <span className="lang-en">{project.trade}</span>
                  <span className="lang-hi">
                    {project.trade === 'Mason' ? 'राजमिस्त्री' :
                     project.trade === 'Carpenter' ? 'बढ़ई' :
                     project.trade === 'Electrician' ? 'इलेक्ट्रीशियन' :
                     project.trade === 'Plumber' ? 'प्लम्बर' :
                     project.trade === 'Painter' ? 'पेंटर' : project.trade}
                  </span>
                </div>
                <div>
                  <i className="fas fa-calendar-alt"></i> {project.start_date}
                </div>
                <div>
                  <i className="fas fa-users"></i> {project.required_count}{' '}
                  <span className="lang-en">needed</span>
                  <span className="lang-hi">चाहिए</span>
                </div>
              </div>

              {/* Hiring Progress */}
              <div className="hiring-progress">
                <div className="hiring-label">
                  <span>
                    <i className="fas fa-user-check"></i>{' '}
                    <span className="lang-en">Workers hired</span>
                    <span className="lang-hi">श्रमिक मिले</span>
                  </span>
                  <span>{project.hired_count} / {project.required_count}</span>
                </div>
                <div className="progress-track">
                  <div
                    className="bar"
                    style={{ width: `${(project.hired_count / project.required_count) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer">
                <span className="price">
                  ₹{project.daily_wage} <small>/day</small>
                </span>
                <Link to="/login" className="btn-apply">
                  <span className="lang-en">Apply Now</span>
                  <span className="lang-hi">अभी आवेदन करें</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;