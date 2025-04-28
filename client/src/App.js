import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import PodDetailPage from './pages/PodDetailPage/PodDetailPage';
import CreatePodPage from './pages/CreatePodPage/CreatePodPage';
import HelpFeed from './pages/HelpFeed/HelpFeed';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/help-feed" element={<HelpFeed />} />
        <Route path="/pods/:id" element={<PodDetailPage />} /> {/* <-- Correct: /pods/:id */}
        <Route path="/create-pod" element={<CreatePodPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;