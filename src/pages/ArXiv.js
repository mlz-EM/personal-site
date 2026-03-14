import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Main from '../layouts/Main';
import useMarkdown from '../hooks/useMarkdown';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';
import 'katex/dist/katex.min.css';

const importArxivMarkdown = () => import('../data/arXivDaily.md');
const ARXIV_TOOLS = [
  { label: 'Top', href: '#arxiv' },
  { label: 'Jobs', to: '/job' },
  { label: 'Resources', to: '/resources' },
];

const ArXiv = () => {
  const { markdown, loading, error } = useMarkdown(importArxivMarkdown);

  return (
    <Main title="arXiv" description="arXiv Daily Feed">
      <article className="post markdown" id="arxiv">
        <PageHeader title="arXiv Daily Feed" />
        <PageTools items={ARXIV_TOOLS} ariaLabel="arXiv page tools" />
        {loading && <p>Loading arXiv feed...</p>}
        {error && <p>Unable to load the arXiv feed.</p>}
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </Main>
  );
};

export default ArXiv;
