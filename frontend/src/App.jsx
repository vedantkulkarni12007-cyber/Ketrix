import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import LessonDetail from './pages/LessonDetail';
import Lab from './pages/Lab';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';
import Simulator from './pages/Simulator';
import './App.css';

const NotFound = () => (
  <div className="container" style={{ maxWidth: '800px', textAlign: 'center', padding: '4rem 2rem' }}>
    <div className="sci-panel" style={{ borderColor: 'var(--accent-red)' }}>
      <div className="tech-label text-red" style={{ marginBottom: '1rem' }}>ERROR 404</div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textTransform: 'uppercase' }}>ROUTE NOT FOUND</h1>
      <p style={{ color: 'var(--text-secondary)' }}>The requested module is offline or does not exist.</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="learn" element={<Learn />} />
          <Route path="learn/:lessonId" element={<LessonDetail />} />
          <Route path="lab" element={<Lab />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="simulator/:experimentId" element={<Simulator />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
