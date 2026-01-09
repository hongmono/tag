import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ProblemViewer } from './components/problem-viewer';
import { LatexRenderer } from './components/latex-renderer';
import './styles/global.css';
import 'katex/dist/katex.min.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="flex gap-4 p-4 bg-white border-b border-gray-200">
      <Link
        to="/"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          location.pathname === '/'
            ? 'bg-indigo-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        수학 문제 뷰어
      </Link>
      <Link
        to="/latex"
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          location.pathname === '/latex'
            ? 'bg-indigo-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        LaTeX 렌더러
      </Link>
    </nav>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<ProblemViewer />} />
        <Route path="/latex" element={<LatexRenderer />} />
      </Routes>
    </Router>
  );
};

export default App;
