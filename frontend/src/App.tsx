import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import CameraPage from './pages/CameraPage';
import MenuPage from './pages/MenuPage';
import SoftcopyPage from './pages/SoftcopyPage';
import LoadingPage from './pages/LoadingPage'; 
import FinishPage from './pages/FinishPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/menu" element={<MenuPage />} /> 
      <Route path="/softcopy" element={<SoftcopyPage />} /> 
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/finish" element={<FinishPage />} />
    </Routes>
  );
}

export default App;