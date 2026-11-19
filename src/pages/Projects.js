import React from 'react';
import Main from '../layouts/Main';
import AdaptiveCard from '../components/Template/AdaptiveCard';
import PageHeader, { ExpandAllButton } from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import { getProjects } from '../content/api';
import useCardExpansion from '../hooks/useCardExpansion';

const PROJECT_TOOLS = [
  { label: 'Top', href: '#projects' },
  { label: 'Publications', to: '/publications' },
  { label: 'News', to: '/news' },
];

const Projects = () => {
  const { anyOpen, toggleAll, cardProps } = useCardExpansion();

  return (
    <Main title="Projects" description="Learn about Menglin Zhu's projects.">
      <article className="post" id="projects">
        <PageHeader
          title="Projects"
          titleActions={<ExpandAllButton anyOpen={anyOpen} onClick={toggleAll} />}
        />
        <PageTools items={PROJECT_TOOLS} ariaLabel="Projects page tools" />
        {getProjects().map((project) => (
          <AdaptiveCard data={project} key={project.title} {...cardProps} />
        ))}
      </article>
    </Main>
  );
};

export default Projects;
