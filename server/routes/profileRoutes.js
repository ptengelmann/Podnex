const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

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

// Add a test route
router.get('/test', (req, res) => {
  console.log('Profile test route hit!');
  res.json({ message: 'Profile routes are working!', timestamp: new Date() });
});

// Configure multer storage for profile images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/profiles/');
  },
  filename: function(req, file, cb) {
    cb(null, `user-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
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
  limits: { fileSize: 5000000 } // 5MB max size
});

// DEBUG ROUTES (Place these FIRST to avoid conflicts)
router.get('/debug', debugProfiles); // Public debug endpoint
router.post('/create-missing', protect, createMissingProfiles); // Protected endpoint to create missing profiles

// Basic profile routes
router.get('/me', protect, getCurrentProfile);
router.put('/', protect, updateProfile);
router.post('/image', protect, upload.single('profileImage'), uploadProfileImage);
router.get('/user/:userId', getProfileByUserId);
router.post('/portfolio', protect, addPortfolioItem);
router.put('/stats', protect, updateProfileStats);
router.get('/top', getTopProfiles);

// Discovery routes (with enhanced debugging)
router.get('/discover', discoverProfiles); // Public route with enhanced features for authenticated users
router.get('/recommendations', protect, getProfileRecommendations); // Private route for personalized recommendations
router.get('/skills/:skillName', getProfilesBySkill); // Public route to filter by skill

// Debug route for profile testing
router.get('/debug-me', (req, res) => {
  console.log('Debug profile route hit!');
  console.log('Headers:', req.headers);
     
  // Try to extract the token manually
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

module.exports = router;