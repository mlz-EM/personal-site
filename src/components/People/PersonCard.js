import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faGoogleScholar } from '@fortawesome/free-brands-svg-icons/faGoogleScholar';
import { faOrcid } from '@fortawesome/free-brands-svg-icons/faOrcid';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';

const formatStartDate = (startDate) => {
  if (!startDate) return null;
  const [year, month] = startDate.split('-');
  if (!year || !month) return startDate;

  const date = new Date(Number(year), Number(month) - 1, 1);
  return `Starting ${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
};

const getProfileLinks = (person) => [
  person.website ? {
    label: 'Website',
    href: person.website,
    icon: faGlobe,
  } : null,
  person.googleScholar ? {
    label: 'Google Scholar',
    href: person.googleScholar,
    icon: faGoogleScholar,
  } : null,
  person.orcid ? {
    label: 'ORCID',
    href: person.orcid.startsWith('http') ? person.orcid : `https://orcid.org/${person.orcid}`,
    icon: faOrcid,
  } : null,
  person.github ? {
    label: 'GitHub',
    href: person.github,
    icon: faGithub,
  } : null,
  person.linkedin ? {
    label: 'LinkedIn',
    href: person.linkedin,
    icon: faLinkedinIn,
  } : null,
].filter(Boolean);

const getThesisLink = (thesis) => {
  if (!thesis) return null;
  if (typeof thesis === 'string') {
    return { href: thesis, label: 'View Thesis' };
  }
  if (typeof thesis === 'object' && thesis.url) {
    return { href: thesis.url, label: thesis.label || 'View Thesis' };
  }
  return null;
};

const PersonCard = ({ person, isExpanded, onToggle }) => {
  const isAlumni = person.status === 'alumni';
  const startLabel = person.status === 'incoming' ? formatStartDate(person.startDate) : null;
  const profileLinks = getProfileLinks(person);
  const thesisLink = getThesisLink(person.thesis);

  return (
    <li
      className={`person-card ${isExpanded ? 'is-expanded' : 'is-compact'}`}
    >
      <div className="person-card-top">
        <img
          className="person-avatar"
          src={`${process.env.PUBLIC_URL}${person.photo}`}
          alt={`${person.name} portrait`}
          loading="lazy"
          decoding="async"
        />
        <div className="person-main">
          <div className="person-name-row">
            <h4 className="person-name">{person.name}</h4>
          </div>
          {person.pronouns ? <p className="person-meta">{person.pronouns}</p> : null}
          {person.currentPosition ? (
            <p className="person-current-position">{person.currentPosition}</p>
          ) : null}
          {startLabel ? <p className="person-start">{startLabel}</p> : null}
        </div>
      </div>

      {!isAlumni ? (
        <div className="person-tags">
          {(person.researchInterests || []).length > 0 ? (
            person.researchInterests.slice(0, 2).map((interest) => (
              <span key={`${person.id}-${interest}`} className="person-tag">{interest}</span>
            ))
          ) : (
            <span className="person-tag person-tag-placeholder">{'\u00A0'}</span>
          )}
        </div>
      ) : null}

      <button
        type="button"
        className={`person-card-corner-toggle ${isExpanded ? 'is-open' : 'is-closed'}`}
        onClick={() => onToggle(person.id)}
        aria-expanded={isExpanded}
        aria-controls={`person-details-${person.id}`}
        aria-label={isExpanded ? `Collapse ${person.name}` : `Expand ${person.name}`}
        title={isExpanded ? 'Close details' : 'Open details'}
      >
        <span className="visually-hidden">
          {isExpanded ? 'Close details' : 'Open details'}
        </span>
        <span className="person-card-corner-icon" aria-hidden="true" />
      </button>

      {isExpanded ? (
        <div id={`person-details-${person.id}`} className="person-details">
          {!isAlumni && person.bio ? <p>{person.bio}</p> : null}
          <p>
            <strong>Role:</strong> {person.role}
          </p>
          {person.email ? (
            <p>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${person.email}`}>{person.email}</a>
            </p>
          ) : null}
          {!isAlumni && person.coadvisor ? (
            <p>
              <strong>Coadvisor:</strong> {person.coadvisor}
            </p>
          ) : null}
          {thesisLink ? (
            <p>
              <strong>Thesis:</strong>{' '}
              <a href={thesisLink.href} target="_blank" rel="noopener noreferrer">
                {thesisLink.label}
              </a>
            </p>
          ) : null}
          {profileLinks.length > 0 ? (
            <ul className="icons person-links">
              {profileLinks.map((link) => (
                <li key={`${person.id}-${link.label}`}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                  >
                    <FontAwesomeIcon icon={link.icon} className="person-link-icon" />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </li>
  );
};

PersonCard.propTypes = {
  person: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string,
    role: PropTypes.string,
    photo: PropTypes.string,
    pronouns: PropTypes.string,
    currentPosition: PropTypes.string,
    startDate: PropTypes.string,
    researchInterests: PropTypes.arrayOf(PropTypes.string),
    bio: PropTypes.string,
    email: PropTypes.string,
    coadvisor: PropTypes.string,
    thesis: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string, label: PropTypes.string }),
    ]),
    website: PropTypes.string,
    googleScholar: PropTypes.string,
    orcid: PropTypes.string,
    github: PropTypes.string,
    linkedin: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default PersonCard;
