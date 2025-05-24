import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import CreatorDashboard from './pages/DashboardPage/CreatorDashboard';
import ContributorDashboard from './pages/DashboardPage/ContributorDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ExplorePage from './pages/ExplorePage/ExplorePage';
import PodDetailPage from './pages/PodDetailPage/PodDetailPage';
import CreatePodPage from './pages/CreatePodPage/CreatePodPage';
import ProfileDiscoveryFeed from './pages/ProfileDiscoveryFeed/ProfileDiscoveryFeed';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactUs/ContactPage';
import PricingSection from './pages/Pricing/PricingSection';
import Community from './pages/Community/Community';
import FAQPage from './pages/FAQ/FAQPage';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import Ecosystem from './pages/Ecosystem/Ecosystem';
// Import the role-specific components
import ApplicationsContributor from './pages/Applications/ApplicationsContributor';
import ApplicationsCreator from './pages/Applications/ApplicationsCreator';
import PodHelp from './pages/PodHelp/PodHelp';

// Import the new PodEnvironment component
import PodEnvironment from './pages/PodEnvironment/PodEnvironment';
// Import the new PodManagementPage component from components directory
import PodManagementPage from './components/PodManagement/PodManagementPage';

// To these
import ProfilePage from './components/profile/ProfilePage';
import ProfileEdit from './components/profile/ProfileEdit';
import AddPortfolioItem from './components/profile/AddPortfolioItem';

// RoleBasedRoute component for handling role-specific routing
const RoleBasedRoute = ({ componentType }) => {
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
      
      // Return appropriate component based on the requested component type
      return componentType === 'dashboard' 
        ? <ContributorDashboard /> 
        : <ApplicationsContributor />;
    }
    
    // Normalize role to lowercase for case-insensitive comparison
    const normalizedRole = user.role.toLowerCase();
    console.log('Normalized role:', normalizedRole);
    
    // Return the appropriate component based on normalized role and component type
    if (componentType === 'dashboard') {
      if (normalizedRole === 'creator') {
        return <CreatorDashboard />;
      } else {
        return <ContributorDashboard />;
      }
    } else if (componentType === 'applications') {
      if (normalizedRole === 'creator') {
        return <ApplicationsCreator />;
      } else {
        return <ApplicationsContributor />;
      }
    } else {
      console.warn(`Unknown component type "${componentType}", defaulting to contributor view`);
      return <ContributorDashboard />;
    }
  } catch (e) {
    console.error(`Error parsing user data for ${componentType} route:`, e);
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
        <Route path="/profile-discovery" element={<ProfileDiscoveryFeed />} />
        <Route path="/pods/:id" element={<PodDetailPage />} />
        <Route path="/create-pod" element={<CreatePodPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingSection />} />
        <Route path="/community" element={<Community />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pod-help" element={<PodHelp />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        
        {/* Profile Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={<ProfilePage />}
        />
        <Route
          path="/settings/profile"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/portfolio/add"
          element={
            <ProtectedRoute>
              <AddPortfolioItem />
            </ProtectedRoute>
          }
        />
        
        {/* New route for PodEnvironment */}
        <Route
          path="/pod-environment/:podId"
          element={
            <ProtectedRoute>
              <PodEnvironment />
            </ProtectedRoute>
          }
        />
        
        {/* New route for PodManagementPage - from components directory */}
        <Route
          path="/pods/:podId/manage"
          element={
            <ProtectedRoute>
              <PodManagementPage />
            </ProtectedRoute>
          }
        />
        
        {/* Role-based dashboard route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RoleBasedRoute componentType="dashboard" />
            </ProtectedRoute>
          }
        />
        
        {/* Role-based applications route */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <RoleBasedRoute componentType="applications" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

export default App;