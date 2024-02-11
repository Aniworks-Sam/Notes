import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import AuthPage from './pages/AuthPage';
import AllNotes from './pages/AllNotes';

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/notes" element={<AllNotes />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Layout>
  );
};

export default App;
