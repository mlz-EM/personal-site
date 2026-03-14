import React from 'react';
import Markdown from 'markdown-to-jsx';
import Main from '../layouts/Main';
import useMarkdown from '../hooks/useMarkdown';
import PageHeader from '../components/Template/PageHeader';
import PageTools from '../components/Template/PageTools';

const importAboutMarkdown = () => import('../data/about.md');
const ABOUT_TOOLS = [
  { label: 'Top', href: '#about' },
  { label: 'Download CV', href: 'https://mlz-em.github.io/personal-site/CV.pdf', external: true },
  { label: 'Publications', to: '/publications' },
];

const About = () => {
  const { markdown, loading, error } = useMarkdown(importAboutMarkdown);

  return (
    <Main title="About" description="Learn about Menglin Zhu">
      <article className="post markdown" id="about">
        <PageHeader
          title={(
            <>
              About (
              <a
                href="https://mlz-em.github.io/personal-site/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
              >
                Download CV
              </a>
              )
            </>
          )}
        />
        <PageTools items={ABOUT_TOOLS} ariaLabel="About page tools" />

        {loading && <p>Loading profile...</p>}
        {error && (
          <p>
            Unable to load profile content. Please refresh this page.
          </p>
        )}
        <Markdown>{markdown}</Markdown>

        <div className="about-figure-grid">
          <img
            src={`${process.env.PUBLIC_URL}/images/about/4D-STEM.gif`}
            alt="4D-STEM Technique"
            className="about-figure about-figure--left"
            loading="lazy"
            decoding="async"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/about/Ptycho.png`}
            alt="Atomic Resolution Imaging"
            className="about-figure about-figure--right"
            loading="lazy"
            decoding="async"
          />
        </div>
      </article>
    </Main>
  );
};

export default About;
