import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import data from '../../data/contact';

const ContactIcons = () => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {data.map((s) => (
      <li
        key={s.label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px', // Ensures consistent spacing
          marginBottom: '4px',
        }}
      >
        <FontAwesomeIcon icon={s.icon} style={{ fontSize: '1.2em' }} />
        <a
          href={s.link}
          aria-label={s.label}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '0.9em',
          }}
        >
          {s.label}
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
