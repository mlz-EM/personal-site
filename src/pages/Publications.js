// pages/Publications.js
import React from 'react';
import Main from '../layouts/Main';
// import BibBaseLoader from '../components/Publications/BibBaseLoader';

const Publications = () => (
  <Main title="Publications" description="Learn about Menglin Zhu's publications.">
    <article className="post" id="publications">
      <header>
        <div className="title">
          <h2>Publications</h2>
          {/* Only "below" is clickable */}
          <p>
            Visit {' '}
            <a
              href="https://scholar.google.com/citations?user=tkEx8OQAAAAJ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Scholar
            </a>
            {' '}page for a full list of my publications.
          </p>
        </div>
      </header>
      {/* Load the BibBase content dynamically */}
      {/* <BibBaseLoader bibUrl="https://bibbase.org/show?bib=https%3A%2F%2Fpaperpile.com%2Feb%2FcChVXXjwmu&commas=true&noBootstrap=1&jsonp=1" /> */}
    </article>
  </Main>
);

export default Publications;
