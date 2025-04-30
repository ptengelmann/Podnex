import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactUs/ContactPage';
import PricingSection from './pages/Pricing/PricingSection';
import Community from './pages/Community/Community';
// Import the new role-specific components
import ApplicationsContributor from './pages/Applications/ApplicationsContributor';
import ApplicationsCreator from './pages/Applications/ApplicationsCreator';

// RoleBasedRoute component for handling role-specific routing - UPDATED
const RoleBasedRoute = ({ children }) => {
  try {
    const storedUser = localStorage.getItem('user');
    
    // If user data doesn't exist, redirect to login
    if (!storedUser) {
      console.log('No user data in localStorage, redirecting to login');
      return <Navigate to="/login" />;
    }
    
    const user = JSON.parse(storedUser);
    
    // Debug the user object
    console.log('User data from localStorage:', user);
    
    // Check if user has a role property
    if (!user.role) {
      console.warn('User data missing role property, defaulting to contributor view');
      // Add a default role to the user object in localStorage
      const updatedUser = { ...user, role: 'contributor' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return <ApplicationsContributor />;
    }
    
    // Normalize role to lowercase for case-insensitive comparison
    const normalizedRole = user.role.toLowerCase();
    console.log('Normalized role:', normalizedRole);
    
    // Return the appropriate component based on normalized role
    if (normalizedRole === 'contributor') {
      return <ApplicationsContributor />;
    } else if (normalizedRole === 'creator') {
      return <ApplicationsCreator />;
    } else {
      console.warn(`Unknown role "${user.role}", defaulting to contributor view`);
      // Update localStorage with a valid role
      const updatedUser = { ...user, role: 'contributor' };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return <ApplicationsContributor />;
    }
  } catch (e) {
    console.error('Error parsing user data for applications route:', e);
    // On error, redirect to login
    return <Navigate to="/login" />;
  }
};

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/help-feed" element={<HelpFeed />} />
        <Route path="/pods/:id" element={<PodDetailPage />} />
        <Route path="/create-pod" element={<CreatePodPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/community" element={<Community />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        
        {/* Role-based applications route */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <RoleBasedRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;