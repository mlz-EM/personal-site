// import React from 'react';
// import dayjs from 'dayjs';

// import Main from '../layouts/Main';
// import Cell from '../components/Projects/Cell';
// import data from '../data/projects';

// const Projects = () => (
//   <Main title="Projects" description="Learn about Menglin Zhu's projects.">
//     <article className="post" id="projects">
//       <header>
//         <div className="title">
//           <h2>Projects</h2>
//         </div>
//       </header>
//       {/* Sort projects by date (newest first) */}
//       {[...data]
//         .sort((a, b) => dayjs(b.date).diff(dayjs(a.date)))
//         .map((project) => (
//           <Cell data={project} key={project.title} />
//         ))}
//     </article>
//   </Main>
// );

// export default Projects;

import React from 'react';
// import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Projects = () => (
  <Main title="Projects" description="Learn about Menglin Zhu's projects.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            Projects
          </h2>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.title} />
      ))}
    </article>
  </Main>
);

export default Projects;
