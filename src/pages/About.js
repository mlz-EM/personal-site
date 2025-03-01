import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
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
  });

  // const count = markdown
  //   .split(/\s+/)
  //   .map((s) => s.replace(/\W/g, ''))
  //   .filter((s) => s.length).length;

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
        <Markdown>{markdown}</Markdown>
      </article>
    </Main>
  );
};

export default About;
