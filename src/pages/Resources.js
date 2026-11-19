import React from 'react';
import Main from '../layouts/Main';
import PageHeader, { ExpandAllButton } from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import useDetailsGroup from '../hooks/useDetailsGroup';
import resources from '../data/resources.json';

const RESOURCES_TOOLS = [
  { label: 'Top', href: '#resources' },
  { label: 'About', to: '/about' },
  { label: 'Jobs', to: '/job' },
];

export const getResourceAssetUrl = (
  src,
  publicUrl = process.env.PUBLIC_URL || '',
) => {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(src)) return src;
  return `${publicUrl.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
};

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
            <source src={getResourceAssetUrl(entry.src)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ))}
      </div>
    );
  }

  const imageSize = item.type === 'imageRow'
    ? { width: '20%', maxWidth: 170 } : { width: '95%', maxWidth: 780 };
  return (
    <div style={{ marginTop: -5, marginBottom: 10 }}>
      {item.media.map((entry) => (
        <img
          key={entry.src}
          src={getResourceAssetUrl(entry.src)}
          alt={entry.alt}
          style={imageSize}
        />
      ))}
    </div>
  );
};

const Resources = () => {
  const { groupProps, anyOpen, toggleAll } = useDetailsGroup();

  return (
    <Main title="Resources" description="Useful Resources">
      <article className="post markdown" id="resources" {...groupProps}>
        <PageHeader
          title="Resources"
          titleActions={<ExpandAllButton anyOpen={anyOpen} onClick={toggleAll} />}
        />
        <PageTools items={RESOURCES_TOOLS} ariaLabel="Resources page tools" />
        {resources.sections.map((section) => (
          <details key={section.title}>
            <summary>
              <strong className="disclosure-title">{section.title}</strong>
            </summary>
            <ul style={{ fontSize: '1em', paddingLeft: '40px' }}>
              {section.items.map(renderLinkItem)}
            </ul>
          </details>
        ))}

        <details>
          <summary>
            <strong className="disclosure-title">{resources.visuals.title}</strong>
          </summary>
          <ul style={{ fontSize: '1em', paddingLeft: '20px' }}>
            {resources.visuals.items.map((item) => (
              <details key={item.title}>
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
