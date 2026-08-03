import React, { useCallback, useRef, useState } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import resources from '../data/resources.json';

const RESOURCES_TOOLS = [
  { label: 'Top', href: '#resources' },
  { label: 'About', to: '/about' },
  { label: 'Jobs', to: '/job' },
];

const renderLinkItem = (item) => (
  <li key={item.label}>
    {item.url ? (
      <a href={item.url} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    ) : (
      item.label
    )}
    {item.children && (
      <ul style={{ fontSize: '1em', paddingLeft: '20px', margin: '0' }}>
        {item.children.map((child) => (
          <li key={`${item.label}-${child.label}`}>
            <a href={child.url} target="_blank" rel="noopener noreferrer">
              {child.label}
            </a>
          </li>
        ))}
      </ul>
    )}
  </li>
);

const renderVisualMedia = (item) => {
  if (item.type === 'imageRow') {
    return (
      <div style={{ paddingLeft: '0px', marginTop: '-5px', marginBottom: '10px' }}>
        {item.media.map((entry) => (
          <img
            key={entry.src}
            src={entry.src}
            alt={entry.alt}
            style={{ width: '20%', maxWidth: '170px' }}
          />
        ))}
      </div>
    );
  }

  if (item.type === 'videoRow') {
    return (
      <div
        style={{
          paddingLeft: '30px',
          marginTop: '0px',
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        {item.media.map((entry) => (
          <video
            key={entry.src}
            style={{ width: '45%', maxWidth: '350px' }}
            controls
            autoPlay
            loop
            muted
          >
            <source src={entry.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: '0px', marginTop: '-5px', marginBottom: '10px' }}>
      {item.media.map((entry) => (
        <img
          key={entry.src}
          src={entry.src}
          alt={entry.alt}
          style={{ width: '95%', maxWidth: '780px' }}
        />
      ))}
    </div>
  );
};

const Resources = () => {
  const detailsContainerRef = useRef(null);
  const [anyOpen, setAnyOpen] = useState(false);

  const refreshOpenState = useCallback(() => {
    const root = detailsContainerRef.current;
    if (!root) {
      setAnyOpen(false);
      return;
    }

    const hasOpenDetail = Array.from(root.querySelectorAll('details')).some((detail) => detail.open);
    setAnyOpen(hasOpenDetail);
  }, []);

  const toggleAllDetails = useCallback((expanded) => {
    const root = detailsContainerRef.current;
    if (!root) {
      return;
    }

    const details = root.querySelectorAll('details');
    for (let i = 0; i < details.length; i += 1) {
      details[i].open = expanded;
    }
    setAnyOpen(expanded);
  }, []);

  const titleActions = (
    <button
      type="button"
      className="page-title-action-btn"
      onClick={() => toggleAllDetails(!anyOpen)}
    >
      {anyOpen ? 'Collapse all' : 'Expand all'}
    </button>
  );

  return (
    <Main title="Resources" description="Useful Resources">
      <article className="post markdown" id="resources" ref={detailsContainerRef}>
        <PageHeader title="Resources" titleActions={titleActions} />
        <PageTools items={RESOURCES_TOOLS} ariaLabel="Resources page tools" />
        {resources.sections.map((section) => (
          <details key={section.title} onToggle={refreshOpenState}>
            <summary>
              <strong style={{ fontSize: '1.1em', paddingLeft: '20px' }}>{section.title}</strong>
            </summary>
            <ul style={{ fontSize: '1em', paddingLeft: '40px' }}>
              {section.items.map(renderLinkItem)}
            </ul>
          </details>
        ))}

        <details onToggle={refreshOpenState}>
          <summary>
            <strong style={{ fontSize: '1.1em', paddingLeft: '20px' }}>{resources.visuals.title}</strong>
          </summary>
          <ul style={{ fontSize: '1em', paddingLeft: '20px' }}>
            {resources.visuals.items.map((item) => (
              <details key={item.title} onToggle={refreshOpenState}>
                <summary style={{ paddingLeft: '5px' }}>{item.title}</summary>
                {renderVisualMedia(item)}
              </details>
            ))}
          </ul>
        </details>
      </article>
    </Main>
  );
};

export default Resources;
