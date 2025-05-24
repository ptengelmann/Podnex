import axios from 'axios';

// Set the base URL for all API requests
const API_URL = 'http://localhost:5000';

/**
 * Discover profiles with various filters
 * @param {Object} filters - Filter criteria
 * @param {string} filters.search - Search term for profiles
 * @param {string} filters.role - Filter by role (creator/contributor)
 * @param {string} filters.tier - Filter by experience tier
 * @param {string} filters.skill - Filter by specific skill
 * @param {string} filters.experience - Filter by experience level
 * @param {string} filters.activity - Filter by recent activity
 * @param {string} filters.sortBy - Sort method (reputation/experience/activity/skills)
 * @param {number} filters.page - Page number for pagination
 * @param {number} filters.limit - Number of results per page
 * @returns {Promise<Array>} Array of profile objects
 */
export const discoverProfiles = async (filters = {}) => {
  try {
    // Create query parameters from filters
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    });
    
    // Add authorization header if user is logged in
    const token = localStorage.getItem('token');
    const config = token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};
    
    const response = await axios.get(
      `${API_URL}/api/profile/discover?${queryParams.toString()}`,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error discovering profiles:', error.message);
    throw error;
  }
};

/**
 * Get personalized profile recommendations
 * @returns {Promise<Array>} Array of recommended profiles
 */
export const getProfileRecommendations = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required for profile recommendations');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    const response = await axios.get(
      `${API_URL}/api/profile/recommendations`,
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error getting profile recommendations:', error.message);
    throw error;
  }
};

/**
 * Get profiles filtered by a specific skill
 * @param {string} skillName - The skill to filter by
 * @returns {Promise<Array>} Array of profiles with matching skill
 */
export const getProfilesBySkill = async (skillName) => {
  try {
    const response = await axios.get(`${API_URL}/api/profile/skills/${skillName}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting profiles by skill ${skillName}:`, error.message);
    throw error;
  }
};

/**
 * Send a message to a user
 * @param {string} userId - ID of the user to message
 * @param {string} content - Message content
 * @returns {Promise<Object>} The created message
 */
export const sendMessage = async (userId, content) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required to send messages');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios.post(
      `${API_URL}/api/messages`,
      { recipient: userId, content },
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.message);
    throw error;
  }
};

/**
 * Invite a user to a pod
 * @param {string} userId - ID of the user to invite
 * @param {string} podId - ID of the pod
 * @param {string} role - Role to invite for
 * @returns {Promise<Object>} The created invitation
 */
export const inviteToPod = async (userId, podId, role) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Authentication required to send invitations');
    }
    
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios.post(
      `${API_URL}/api/pods/${podId}/invite`,
      { userId, role },
      config
    );
    
    return response.data;
  } catch (error) {
    console.error('Error inviting to pod:', error.message);
    throw error;
  }
};

export default {
  discoverProfiles,
  getProfileRecommendations,
  getProfilesBySkill,
  sendMessage,
  inviteToPod
};