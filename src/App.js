import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './static/css/main.scss'; // All of our styles
import 'katex/dist/katex.min.css';
import About from './pages/About';
import Index from './pages/Index';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import Resources from './pages/Resources';
import News from './pages/News';
import People from './pages/People';
import Stats from './pages/Stats';

const ArXiv = lazy(() => import('./pages/ArXiv'));
const Job = lazy(() => import('./pages/Job'));

const { PUBLIC_URL } = process.env;

const App = () => (
  <BrowserRouter
    basename={PUBLIC_URL}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/people" element={<People />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/news" element={<News />} />
        <Route path="/arxiv" element={<ArXiv />} />
        <Route path="/job" element={<Job />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
