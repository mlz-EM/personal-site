import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Main from '../layouts/Main';

const About = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/about.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []); // Added empty dependency array

  return (
    <Main title="About" description="Learn about Menglin Zhu">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              About (<a href="https://mlz-em.github.io/personal-site/CV.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', borderBottom: '1px dashed' }}>Download CV</a>)
            </h2>
          </div>
        </header>
        {/* Markdown content for text */}
        <Markdown>{markdown}</Markdown>
        {/* Directly added images */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '-1rem  0rem 2rem', // Added more top margin (4rem) and bottom margin (3rem)
          gap: '-1rem', // Added gap between images
        }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/about/4D-STEM.gif`}
            alt="4D-STEM Technique"
            style={{
              width: '37%',
              height: 'auto',
              objectFit: 'contain',
              marginLeft: '3rem', // Additional top margin for first image
              marginTop: '0.4rem', // Additional top margin for first image
            }}
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/about/Ptycho.png`}
            alt="Atomic Resolution Imaging"
            style={{
              width: '48%',
              height: 'auto',
              objectFit: 'contain',
              marginRight: '3rem', // Additional bottom margin for second image
            }}
          />
        </div>
      </article>
    </Main>
  );
};

export default About;
