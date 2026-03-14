import React from 'react';
import Markdown from 'markdown-to-jsx';
import Main from '../layouts/Main';
import useMarkdown from '../hooks/useMarkdown';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';

const importResourcesMarkdown = () => import('../data/resources.md');
const RESOURCES_TOOLS = [
  { label: 'Top', href: '#resources' },
  { label: 'About', to: '/about' },
  { label: 'Jobs', to: '/job' },
];

const Resources = () => {
  const { markdown, loading, error } = useMarkdown(importResourcesMarkdown);

  return (
    <Main title="Resources" description="Useful Resources">
      <article className="post markdown" id="resources">
        <PageHeader title="Resources" />
        <PageTools items={RESOURCES_TOOLS} ariaLabel="Resources page tools" />
        {loading && <p>Loading resources...</p>}
        {error && <p>Unable to load resources right now.</p>}
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default Resources;
