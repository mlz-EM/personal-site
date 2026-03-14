import React from 'react';
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

const Projects = () => (
  <Main title="Projects" description="Learn about Menglin Zhu's projects.">
    <article className="post" id="projects">
      <PageHeader title="Projects" />
      <PageTools items={PROJECT_TOOLS} ariaLabel="Projects page tools" />
      {getProjects().map((project) => (
        <AdaptiveCard
          data={project}
          key={project.title}
          enableExpand={ENABLE_PER_CARD_EXPAND}
        />
      ))}
    </article>
  </Main>
);

export default Projects;
