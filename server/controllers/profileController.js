const Profile = require('../models/Profile');
const User = require('../models/User');
const PodMember = require('../models/PodMember');
const Pod = require('../models/Pod');
const Task = require('../models/Task');
const mongoose = require('mongoose');

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
const getCurrentProfile = async (req, res) => {
  console.log('getCurrentProfile controller function called');
  console.log('User ID from request:', req.user.id);
  
  try {
    // Find profile by user ID
    console.log('Looking for profile with user ID:', req.user.id);
    let profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'role', 'reputation']);
    
    console.log('Profile found:', profile ? 'Yes' : 'No');

    // If no profile exists, create a default one
    if (!profile) {
      console.log('No profile found, creating default profile');
      const user = await User.findById(req.user.id);
      
      if (!user) {
        console.log('User not found for profile creation');
        return res.status(404).json({ message: 'User not found' });
      }
      
      console.log('Creating profile for user:', user.name);
      profile = await Profile.create({
        user: req.user.id,
        displayName: user.name
      });
      
      console.log('New profile created with ID:', profile._id);
      
      // Populate the user field after creation
      profile = await Profile.findById(profile._id).populate('user', ['name', 'email', 'role', 'reputation']);
    }

    console.log('Sending profile response');
    res.json(profile);
  } catch (error) {
    console.error('Error in getCurrentProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  console.log('updateProfile controller function called');
  console.log('Request body:', req.body);
  
  const {
    displayName,
    headline,
    bio,
    skills,
    socialLinks,
    visibility
  } = req.body;

  // Build profile object
  const profileFields = {};
  if (displayName) profileFields.displayName = displayName;
  if (headline) profileFields.headline = headline;
  if (bio) profileFields.bio = bio;
  if (skills) profileFields.skills = skills;
  if (socialLinks) profileFields.socialLinks = socialLinks;
  if (visibility) profileFields.visibility = visibility;

  try {
    console.log('Looking for existing profile');
    // Find profile
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      console.log('Existing profile found, updating it');
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).populate('user', ['name', 'email', 'role', 'reputation']);

      console.log('Profile updated');
      return res.json(profile);
    }

    // Create profile if not found
    console.log('No existing profile found, creating new one');
    const user = await User.findById(req.user.id);
    profileFields.user = req.user.id;
    profileFields.displayName = profileFields.displayName || user.name;

    profile = new Profile(profileFields);
    await profile.save();
    
    // Populate user data
    profile = await Profile.findById(profile._id).populate('user', ['name', 'email', 'role', 'reputation']);
    
    console.log('New profile created');
    res.json(profile);
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Upload profile image
// @route   POST /api/profile/image
// @access  Private
const uploadProfileImage = async (req, res) => {
  console.log('uploadProfileImage controller function called');
  
  try {
    // Handle file upload logic here
    // You'll need to implement file upload middleware like multer
    
    const imageUrl = req.file ? req.file.path : null;
    
    console.log('Image file received:', imageUrl ? 'Yes' : 'No');
    
    if (!imageUrl) {
      console.log('No image file provided');
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Update profile with image URL
    console.log('Updating profile with image URL:', imageUrl);
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: { profileImage: imageUrl } },
      { new: true }
    );
    
    console.log('Profile updated with image');
    res.json({ imageUrl, profile });
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:userId
// @access  Public
const getProfileByUserId = async (req, res) => {
  console.log('getProfileByUserId controller function called');
  console.log('User ID parameter:', req.params.userId);
  
  try {
    console.log('Looking for profile with user ID:', req.params.userId);
    const profile = await Profile.findOne({ 
      user: req.params.userId 
    }).populate('user', ['name', 'email', 'role', 'reputation']);
    
    if (!profile) {
      console.log('Profile not found');
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    console.log('Profile found');
    res.json(profile);
  } catch (error) {
    console.error('Error in getProfileByUserId:', error);
    if (error.kind === 'ObjectId') {
      console.log('Invalid ObjectId format');
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add portfolio item
// @route   POST /api/profile/portfolio
// @access  Private
const addPortfolioItem = async (req, res) => {
  console.log('addPortfolioItem controller function called');
  console.log('Request body:', req.body);
  
  const {
    title,
    description,
    podId,
    images,
    link,
    featured
  } = req.body;
  
  try {
    console.log('Looking for profile to add portfolio item');
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      console.log('Profile not found');
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    console.log('Profile found, creating portfolio item');
    const newPortfolio = {
      title,
      description,
      podId,
      images: images || [],
      link,
      featured: featured || false
    };
    
    profile.portfolio.unshift(newPortfolio);
    await profile.save();
    
    console.log('Portfolio item added');
    res.json(profile);
  } catch (error) {
    console.error('Error in addPortfolioItem:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update profile stats
// @route   PUT /api/profile/stats
// @access  Private (this would typically be called by other parts of your system)
const updateProfileStats = async (req, res) => {
  console.log('updateProfileStats controller function called');
  
  try {
    const userId = req.user.id;
    console.log('Updating stats for user ID:', userId);
    
    // Calculate stats from database
    console.log('Calculating stats from database');
    const podsCreated = await Pod.countDocuments({ creator: userId });
    console.log('Pods created:', podsCreated);
    
    const podsMembership = await PodMember.find({ user: userId });
    const podsJoined = podsMembership.length;
    console.log('Pods joined:', podsJoined);
    
    const tasksCompleted = await Task.countDocuments({ 
      assignedTo: userId,
      status: 'completed'
    });
    console.log('Tasks completed:', tasksCompleted);
    
    // Calculate success rate (completed tasks / total assigned tasks)
    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const successRate = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
    console.log('Success rate:', successRate);
    
    // Update profile stats
    console.log('Updating profile with calculated stats');
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { 
        $set: { 
          'stats.podsCreated': podsCreated,
          'stats.podsJoined': podsJoined,
          'stats.tasksCompleted': tasksCompleted,
          'stats.successRate': successRate
        } 
      },
      { new: true }
    );
    
    console.log('Profile stats updated');
    res.json(profile);
  } catch (error) {
    console.error('Error in updateProfileStats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get top profiles based on reputation
// @route   GET /api/profile/top
// @access  Public
const getTopProfiles = async (req, res) => {
  console.log('getTopProfiles controller function called');
  
  try {
    // Find users with highest reputation
    console.log('Finding top users by reputation');
    const users = await User.find().sort({ reputation: -1 }).limit(10);
    console.log(`Found ${users.length} top users`);
    
    // Get their profiles
    console.log('Getting profiles for top users');
    const profiles = await Promise.all(
      users.map(async (user) => {
        const profile = await Profile.findOne({ user: user._id })
          .populate('user', ['name', 'role', 'reputation']);
        return profile;
      })
    );
    
    // Filter out null profiles
    const validProfiles = profiles.filter(profile => profile !== null);
    console.log(`Returning ${validProfiles.length} valid profiles`);
    
    res.json(validProfiles);
  } catch (error) {
    console.error('Error in getTopProfiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentProfile,
  updateProfile,
  uploadProfileImage,
  getProfileByUserId,
  addPortfolioItem,
  updateProfileStats,
  getTopProfiles
};