import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Main from '../layouts/Main';

const Publications = () => {
  const [iframeHeight, setIframeHeight] = useState('1000px');

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        // Ensure the message is from the iframe's origin
        if (event.origin !== 'https://bibbase.org') return;

        // Parse the height data
        const data = JSON.parse(event.data);
        if (data.type === 'bibbase-height') {
          // Add a small buffer to ensure no scrollbar appears
          setIframeHeight(`${data.height + 10}px`);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <Main title="Publications" description="Learn about Menglin Zhu's publications.">
      <article className="post" id="publications">
        <header>
          <div className="title">
            <h2><Link to="/publications">Publications</Link></h2>
            <p>Find the full list from my </p>
          </div>
        </header>

        {/* Bibliography Section */}
        <section style={{ padding: '0', overflow: 'hidden', height: iframeHeight }}>
          <iframe
            src="https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu&commas=false&noBootstrap=1&showSearch=true&owner=zhu"
            width="100%"
            style={{
              border: 'none',
              display: 'block',
              height: iframeHeight,
            }}
            title="BibBase Publications"
            onLoad={(e) => {
              // Send message to iframe to request height
              e.target.contentWindow.postMessage(
                { type: 'get-bibbase-height' },
                'https://bibbase.org',
              );
            }}
          />
        </section>
      </article>
    </Main>
  );
};

export default Publications;
