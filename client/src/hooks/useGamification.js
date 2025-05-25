// client/src/hooks/useGamification.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useGamification = () => {
  const [gamificationData, setGamificationData] = useState({
    totalXP: 0,
    currentLevel: 1,
    tier: 'bronze',
    badges: [],
    stats: {},
    loading: true,
    error: null
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchGamificationData = async () => {
      if (!user?._id) {
        setGamificationData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token');
        }

        // Fetch user's gamification progress
        const response = await axios.get('/api/gamification/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const progress = response.data.data;
          
          setGamificationData({
            totalXP: progress.totalXP || 0,
            currentLevel: progress.currentLevel || 1,
            tier: progress.tier || 'bronze',
            badges: progress.badges || [],
            stats: progress.stats || {},
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error fetching gamification data:', error);
        setGamificationData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.error || 'Failed to load gamification data'
        }));
      }
    };

    fetchGamificationData();
  }, [user]);

  // Helper functions
  const getTrustLevel = (xp, tier) => {
    if (tier === 'platinum') return 'Platinum';
    if (tier === 'gold') return 'Gold';
    if (tier === 'silver') return 'Silver';
    if (xp >= 500) return 'Gold';
    if (xp >= 200) return 'Silver';
    return 'Bronze';
  };

  const getXPProgress = (currentXP, currentLevel) => {
    // XP needed for next level = (level^2) * 100
    const xpForNextLevel = Math.pow(currentLevel + 1, 2) * 100;
    const xpForCurrentLevel = currentLevel > 1 ? Math.pow(currentLevel, 2) * 100 : 0;
    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
    const xpProgressInLevel = currentXP - xpForCurrentLevel;
    
    return {
      current: xpProgressInLevel,
      needed: xpNeededForNext,
      percentage: Math.min((xpProgressInLevel / xpNeededForNext) * 100, 100)
    };
  };

  const getTierInfo = (tier) => {
    const tierInfo = {
      bronze: { color: '#CD7F32', name: 'Bronze', icon: '🥉' },
      silver: { color: '#C0C0C0', name: 'Silver', icon: '🥈' },
      gold: { color: '#FFD700', name: 'Gold', icon: '🥇' },
      platinum: { color: '#E5E4E2', name: 'Platinum', icon: '💎' }
    };
    return tierInfo[tier] || tierInfo.bronze;
  };

  const refreshGamificationData = async () => {
    setGamificationData(prev => ({ ...prev, loading: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/gamification/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const progress = response.data.data;
        setGamificationData({
          totalXP: progress.totalXP || 0,
          currentLevel: progress.currentLevel || 1,
          tier: progress.tier || 'bronze',
          badges: progress.badges || [],
          stats: progress.stats || {},
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error refreshing gamification data:', error);
      setGamificationData(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.error || 'Failed to refresh data'
      }));
    }
  };

  return {
    ...gamificationData,
    trustLevel: getTrustLevel(gamificationData.totalXP, gamificationData.tier),
    xpProgress: getXPProgress(gamificationData.totalXP, gamificationData.currentLevel),
    tierInfo: getTierInfo(gamificationData.tier),
    refresh: refreshGamificationData
  };
};

export default useGamification;