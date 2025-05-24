import axios from 'axios';

// Set the base URL for all API requests
const API_URL = 'http://localhost:5000';

// Function to create a fallback profile
const createFallbackProfile = () => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    throw new Error('User data not found in localStorage');
  }
  
  const user = JSON.parse(userData);
  
  return {
    success: true,
    profile: {
      user: {
        _id: user._id || user.id,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'contributor'
      },
      displayName: user.name || '',
      headline: '',
      bio: '',
      skills: [],
      socialLinks: {},
      stats: {
        podsCreated: 0,
        podsJoined: 0,
        tasksCompleted: 0,
        contributionCount: 0,
        successRate: 0
      },
      visibility: {
        skills: true,
        badges: true,
        stats: true,
        podsHistory: true
      },
      experience: {
        currentXP: 0,
        level: 1,
        tier: 'bronze'
      },
      portfolio: []
    }
  };
};

// Get user profile
export const getCurrentProfile = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found in localStorage');
    return createFallbackProfile();
  }
  
  console.log('Token found, making profile request...');
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  try {
    console.log('Making request to:', `${API_URL}/api/profile/me`);
    const response = await axios.get(`${API_URL}/api/profile/me`, config);
    console.log('Profile response received:', response.data);
    
    // Handle different response structures
    let profileData = response.data;
    
    // If the response is just the profile object without wrapper
    if (profileData && !profileData.profile && !profileData.success) {
      profileData = {
        success: true,
        profile: profileData
      };
    }
    
    // Ensure user data exists in the profile
    if (profileData.profile && !profileData.profile.user) {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      profileData.profile.user = {
        _id: userData._id || userData.id,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'contributor'
      };
    }
    
    // Update localStorage with the latest user data if available
    if (profileData.profile && profileData.profile.user) {
      localStorage.setItem('user', JSON.stringify(profileData.profile.user));
    }
    
    console.log('Processed profile data:', profileData);
    return profileData;
    
  } catch (error) {
    console.error('Profile request failed:', error);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
    
    // Always use fallback on any error
    console.log('Using fallback profile due to error');
    return createFallbackProfile();
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found for updateProfile');
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await axios.put(`${API_URL}/api/profile`, profileData, config);
    
    // Update localStorage if user data changed
    if (response.data && response.data.profile && response.data.profile.user) {
      localStorage.setItem('user', JSON.stringify(response.data.profile.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.message);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (formData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found for uploadProfileImage');
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/profile/image`, formData, config);
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

// Get profile by user ID
export const getProfileByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/profile/user/${userId}`);
    console.log('Profile by user ID response:', response.data);
    
    // Handle different response structures
    let profileData = response.data;
    
    if (profileData && !profileData.profile && !profileData.success) {
      profileData = {
        success: true,
        profile: profileData
      };
    }
    
    return profileData;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error.message);
    throw error;
  }
};

// Add portfolio item
export const addPortfolioItem = async (portfolioData) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found for addPortfolioItem');
    throw new Error('Authentication required');
  }
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await axios.post(`${API_URL}/api/profile/portfolio`, portfolioData, config);
    return response.data;
  } catch (error) {
    console.error('Error adding portfolio item:', error.message);
    throw error;
  }
};

// Get top profiles
export const getTopProfiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/profile/top`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top profiles:', error.message);
    throw error;
  }
};

// Helper function to sync user data between profile and localStorage
export const syncUserData = (profileData) => {
  if (profileData && profileData.profile && profileData.profile.user) {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      ...profileData.profile.user
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
};