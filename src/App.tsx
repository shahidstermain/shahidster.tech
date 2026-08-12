import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import SEO from './components/SEO';

const HOME_URL = 'https://shahidster.tech';
const HOME_IMAGE = `${HOME_URL}/shahid-moosa.jpg`;

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${HOME_URL}/#person`,
      name: 'Shahid Moosa',
      url: HOME_URL,
      image: HOME_IMAGE,
      jobTitle: 'Cloud Database Support Engineer',
      worksFor: {
        '@type': 'Organization',
        name: 'SingleStore',
        url: 'https://www.singlestore.com/',
      },
      sameAs: [
        'https://github.com/shahidstermain',
        'https://www.linkedin.com/in/shahidmoosa',
      ],
      knowsAbout: [
        'PostgreSQL',
        'SingleStore',
        'Distributed SQL',
        'Database reliability',
        'SQL performance tuning',
        'Database replication',
        'AWS cloud infrastructure',
        'Production incident troubleshooting',
      ],
    },
    {
      '@type': 'ProfilePage',
      '@id': `${HOME_URL}/#profile`,
      url: HOME_URL,
      name: 'Shahid Moosa - Cloud Database Support Engineer',
      description: 'Portfolio and engineering resources covering PostgreSQL, SingleStore, distributed SQL, database reliability, AWS, performance tuning, replication, and production troubleshooting.',
      mainEntity: {
        '@id': `${HOME_URL}/#person`,
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebSite',
      '@id': `${HOME_URL}/#website`,
      url: HOME_URL,
      name: 'Shahid Moosa | Cloud Database Engineering',
      description: 'Technical portfolio and engineering blog focused on cloud databases, PostgreSQL, distributed systems, database reliability, and production troubleshooting.',
      publisher: {
        '@id': `${HOME_URL}/#person`,
      },
      inLanguage: 'en-US',
    },
  ],
};

/**
 * Global App Wrapper for layout and global effects.
 */
const App = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-container">
      {pathname === '/' && (
        <SEO
          title="Shahid Moosa | Cloud Database Support Engineer | PostgreSQL & Distributed SQL"
          description="Cloud Database Support Engineer specializing in PostgreSQL, SingleStore, distributed SQL, AWS, database reliability, SQL performance, replication, and production incident troubleshooting."
          url={HOME_URL}
          image={HOME_IMAGE}
          imageAlt="Shahid Moosa, Cloud Database Support Engineer"
          type="profile"
          jsonLd={homeStructuredData}
        />
      )}
      <Outlet />
    </div>
  );
};

export default App;
