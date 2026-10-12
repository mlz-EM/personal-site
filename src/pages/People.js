import React, { useMemo, useState } from 'react';
import Main from '../layouts/Main';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import peopleData from '../data/people.json';
import { getVisiblePeople, groupPeople } from '../content/people';
import PersonCard from '../components/People/PersonCard';

const PEOPLE_TOOLS = [
  { label: 'Top', href: '#people' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
];

const sectionId = (title) => `people-section-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const People = () => {
  const peopleList = Array.isArray(peopleData.people) ? peopleData.people : [];

  const [expandedById, setExpandedById] = useState(() => (
    peopleList
      .filter((person) => person.showOnPage)
      .reduce((acc, person) => ({ ...acc, [person.id]: true }), {})
  ));

  const visiblePeople = useMemo(() => getVisiblePeople(peopleList), [peopleList]);
  const groupedPeople = useMemo(() => groupPeople(visiblePeople), [visiblePeople]);

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
                {section.members.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    isExpanded={!!expandedById[person.id]}
                    onToggle={togglePerson}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </article>
    </Main>
  );
};

export default People;
