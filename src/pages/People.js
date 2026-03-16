import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faGoogleScholar } from '@fortawesome/free-brands-svg-icons/faGoogleScholar';
import { faOrcid } from '@fortawesome/free-brands-svg-icons/faOrcid';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import peopleData from '../data/people.json';

const PEOPLE_TOOLS = [
  { label: 'Top', href: '#people' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

const SECTION_ORDER = [
  'Principal Investigator',
  'Postdocs',
  'PhD Students',
  "Master's Students",
  'Undergraduate Students',
  'Visiting Scholars',
  'Alumni',
  'Other Members',
];

const getSectionTitle = (person) => {
  if ((person.status || '').toLowerCase() === 'alumni') return 'Alumni';
  const role = person.role || '';
  const normalized = role.trim().toLowerCase();

  if (normalized.includes('principal investigator') || normalized === 'pi') return 'Principal Investigator';
  if (normalized.includes('postdoc')) return 'Postdocs';
  if (normalized.includes('phd')) return 'PhD Students';
  if (normalized.includes('master')) return "Master's Students";
  if (normalized.includes('undergrad')) return 'Undergraduate Students';
  if (normalized.includes('visiting')) return 'Visiting Scholars';
  if (normalized.includes('alumni')) return 'Alumni';

  return 'Other Members';
};

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

const sectionId = (title) => `people-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const People = () => {
  const peopleList = Array.isArray(peopleData.people) ? peopleData.people : [];

  const [expandedById, setExpandedById] = useState(() => (
    peopleList
      .filter((person) => person.showOnPage)
      .reduce((acc, person) => ({ ...acc, [person.id]: true }), {})
  ));

  const visiblePeople = useMemo(() => (
    peopleList
      .filter((person) => person.showOnPage)
      .sort((a, b) => {
        const orderDiff = (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999);
        if (orderDiff !== 0) return orderDiff;
        return a.name.localeCompare(b.name);
      })
  ), [peopleList]);

  const groupedPeople = useMemo(() => {
    const grouped = visiblePeople.reduce((acc, person) => {
      const section = getSectionTitle(person);
      if (!acc[section]) acc[section] = [];
      acc[section].push(person);
      return acc;
    }, {});

    return SECTION_ORDER
      .filter((section) => grouped[section]?.length)
      .map((section) => ({
        title: section,
        members: grouped[section],
      }));
  }, [visiblePeople]);

  const visibleIds = visiblePeople.map((person) => person.id);
  const anyExpanded = visibleIds.some((id) => expandedById[id]);

  const toggleAll = (expanded) => {
    const next = { ...expandedById };
    visibleIds.forEach((id) => {
      next[id] = expanded;
    });
    setExpandedById(next);
  };

  const titleActions = (
    <button
      type="button"
      className="page-title-action-btn"
      onClick={() => toggleAll(!anyExpanded)}
    >
      {anyExpanded ? 'Collapse all' : 'Expand all'}
    </button>
  );

  const togglePerson = (id) => {
    setExpandedById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Main title="People" description="Current and incoming group members.">
      <article className="post" id="people">
        <PageHeader
          title={peopleData.page.title}
          titleActions={titleActions}
        />
        <PageTools items={PEOPLE_TOOLS} ariaLabel="People page tools" />
        {groupedPeople.length > 0 ? (
          <div className="people-category-nav">
            {groupedPeople
              .filter((section) => section.title !== 'Principal Investigator')
              .map((section) => (
                <a key={section.title} className="people-category-btn" href={`#${sectionId(section.title)}`}>
                  {section.title}
                </a>
              ))}
          </div>
        ) : null}

        {groupedPeople.length === 0 ? (
          <p className="people-empty">No members available.</p>
        ) : (
          groupedPeople.map((section) => (
            <section key={section.title} id={sectionId(section.title)} className="people-section">
              <h3 className="people-section-title">{section.title}</h3>
              <ul className="people-grid">
                {section.members.map((person) => {
                  const isExpanded = !!expandedById[person.id];
                  const isAlumni = person.status === 'alumni';
                  const startLabel = person.status === 'incoming' ? formatStartDate(person.startDate) : null;
                  const profileLinks = getProfileLinks(person);
                  const thesisLink = getThesisLink(person.thesis);

                  return (
                    <li
                      key={person.id}
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
                        onClick={() => togglePerson(person.id)}
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
                })}
              </ul>
            </section>
          ))
        )}
      </article>
    </Main>
  );
};

export default People;
