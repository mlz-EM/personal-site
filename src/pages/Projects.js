import React, { useCallback, useState } from 'react';
import Main from '../layouts/Main';
import AdaptiveCard from '../components/Template/AdaptiveCard';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { getProjects } from '../content/api';

const ENABLE_PER_CARD_EXPAND = true;
const PROJECT_TOOLS = [
  { label: 'Top', href: '#projects' },
  { label: 'Publications', to: '/publications' },
  { label: 'Misc', to: '/miscellaneous' },
];

const Projects = () => {
  const [bulkCommand, setBulkCommand] = useState({ expanded: false, nonce: 0 });
  const [expandedStates, setExpandedStates] = useState({});

  const runBulkCommand = (expanded) => {
    setBulkCommand((prev) => ({
      expanded,
      nonce: prev.nonce + 1,
    }));
  };
  const handleExpandedChange = useCallback((cardId, isExpanded) => {
    setExpandedStates((prev) => (
      prev[cardId] === isExpanded
        ? prev
        : {
          ...prev,
          [cardId]: isExpanded,
        }
    ));
  }, []);
  const anyOpen = Object.values(expandedStates).some(Boolean);

  const titleActions = (
    <button
      type="button"
      className="page-title-action-btn"
      onClick={() => runBulkCommand(!anyOpen)}
    >
      {anyOpen ? 'Collapse all' : 'Expand all'}
    </button>
  );

  return (
    <Main title="Projects" description="Learn about Menglin Zhu's projects.">
      <article className="post" id="projects">
        <PageHeader title="Projects" titleActions={titleActions} />
        <PageTools items={PROJECT_TOOLS} ariaLabel="Projects page tools" />
        {getProjects().map((project) => (
          <AdaptiveCard
            data={project}
            key={project.title}
            cardId={project.title}
            enableExpand={ENABLE_PER_CARD_EXPAND}
            bulkCommand={bulkCommand}
            onExpandedChange={handleExpandedChange}
          />
        ))}
      </article>
    </Main>
  );
};

export default Projects;
