import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import Main from '../layouts/Main';
import 'katex/dist/katex.min.css'; // Make sure this is imported

const ArXiv = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    import('../data/arXivDaily.md').then((res) => {
      fetch(res.default)
        .then((r) => r.text())
        .then(setMarkdown);
    });
  }, []);

  return (
    <Main title="arXiv" description="arXiv Daily Feed">
      <article className="post markdown" id="about">
        <header>
          <div className="title">
            <h2>
              arXiv Daily Feed
            </h2>
          </div>
        </header>
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
