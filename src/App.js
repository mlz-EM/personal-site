import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './layouts/Main'; // fallback for lazy pages
import './static/css/main.scss'; // All of our styles
import 'katex/dist/katex.min.css';

const { PUBLIC_URL } = process.env;

// Every route - we lazy load so that each page can be chunked
// NOTE that some of these chunks are very small. We should optimize
// which pages are lazy loaded in the future.
const About = lazy(() => import('./pages/About'));
const Index = lazy(() => import('./pages/Index'));
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Projects = lazy(() => import('./pages/Projects'));
const Publications = lazy(() => import('./pages/Publications'));
const Resources = lazy(() => import('./pages/Resources'));
const Miscellaneous = lazy(() => import('./pages/Miscellaneous'));
const ArXiv = lazy(() => import('./pages/ArXiv'));
const Job = lazy(() => import('./pages/Job'));

const App = () => (
  <BrowserRouter basename={PUBLIC_URL}>
    <Suspense fallback={<Main />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/miscellaneous" element={<Miscellaneous />} />
        <Route path="/arxiv" element={<ArXiv />} />
        <Route path="/job" element={<Job />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
