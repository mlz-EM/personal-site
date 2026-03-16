import React from 'react';
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
import Miscellaneous from './pages/Miscellaneous';
import ArXiv from './pages/ArXiv';
import Job from './pages/Job';

const { PUBLIC_URL } = process.env;

const App = () => (
  <BrowserRouter
    basename={PUBLIC_URL}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
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
  </BrowserRouter>
);

export default App;
