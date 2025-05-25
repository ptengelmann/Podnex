const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Import Profile model (THIS WAS MISSING!)
const Profile = require('../models/Profile');

// Import profile controller
const {
  getCurrentProfile,
  updateProfile,
  uploadProfileImage,
  getProfileByUserId,
  addPortfolioItem,
  updateProfileStats,
  getTopProfiles,
  discoverProfiles,
  getProfileRecommendations,
  getProfilesBySkill,
  debugProfiles,
  createMissingProfiles
} = require('../controllers/profileController');

// Configure multer storage for profile images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
     
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5000000 }
});

// DEBUG ROUTES (Place these FIRST)
router.get('/debug', debugProfiles);
router.post('/create-missing', protect, createMissingProfiles);

// Test route
router.get('/test', (req, res) => {
  console.log('Profile test route hit!');
  res.json({ message: 'Profile routes are working!', timestamp: new Date() });
});

// Debug route for profile testing
router.get('/debug-me', (req, res) => {
  console.log('Debug profile route hit!');
  console.log('Headers:', req.headers);
     
  let token = null;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token found:', token ? 'Yes' : 'No');
  } else {
    console.log('No Authorization header found');
  }
     
  res.json({
    message: 'Profile debug route works!',
    headers: req.headers,
    tokenFound: !!token
  });
});

// FIXED DISCOVER ROUTE - Only one definition with proper error handling
router.get('/discover', async (req, res) => {
  try {
    console.log('Discover route hit with query:', req.query);
    
    // Build query object
    const query = {};
    const { skills, level, search, limit = 20, page = 1 } = req.query;
    
    // Add skill filter
    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      query['skills.name'] = { $in: skillsArray };
    }
    
    // Add level filter
    if (level) {
      query['experience.tier'] = level;
    }
    
    // Add search filter
    if (search) {
      query.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { headline: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('Final query:', JSON.stringify(query, null, 2));
    
    // Fetch profiles with proper error handling
    const profiles = await Profile.find(query)
      .populate('user', 'name email role reputation')
      .sort({ 'experience.currentXP': -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean(); // Use lean() for better performance
    
    console.log(`Found ${profiles.length} profiles`);
    
    // Add gamification data safely
    const GamificationService = require('../services/GamificationService');
    
    const profilesWithGamification = await Promise.all(
      profiles.map(async (profile) => {
        try {
          if (!profile.user || !profile.user._id) {
            console.warn('Profile missing user data:', profile._id);
            return profile;
          }
          
          const userProgress = await GamificationService.getUserProgress(profile.user._id);
          
          return {
            ...profile,
            user: {
              ...profile.user,
              totalXP: userProgress?.totalXP || profile.experience?.currentXP || 0,
              currentLevel: userProgress?.currentLevel || profile.experience?.level || 1,
              tier: userProgress?.tier || profile.experience?.tier || 'bronze',
              badges: userProgress?.badges || profile.badges || []
            }
          };
        } catch (gamError) {
          console.error(`Gamification error for user ${profile.user?._id}:`, gamError.message);
          return profile;
        }
      })
    );
    
    // Get total count for pagination
    const total = await Profile.countDocuments(query);
    
    res.json({
      success: true,
      profiles: profilesWithGamification,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
    
  } catch (error) {
    console.error('Error in profile discovery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profiles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Basic profile routes
router.get('/me', protect, getCurrentProfile);
router.put('/', protect, updateProfile);
router.post('/image', protect, upload.single('profileImage'), uploadProfileImage);
router.get('/user/:userId', getProfileByUserId);
router.post('/portfolio', protect, addPortfolioItem);
router.put('/stats', protect, updateProfileStats);
router.get('/top', getTopProfiles);

// Other discovery routes
router.get('/recommendations', protect, getProfileRecommendations);
router.get('/skills/:skillName', getProfilesBySkill);

module.exports = router;