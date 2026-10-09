import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Learn from './pages/Learn';
import LessonDetail from './pages/LessonDetail';
import Lab from './pages/Lab';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';
import './App.css';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
