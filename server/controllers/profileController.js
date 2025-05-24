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
        displayName: user.name,
        // Add default skills to make profiles more discoverable
        skills: [
          {
            name: user.role === 'creator' ? 'Project Management' : 'General Skills',
            level: 'intermediate',
            yearsExperience: 1
          }
        ],
        // Set default experience values
        experience: {
          currentXP: 100,
          level: 1,
          tier: 'bronze'
        },
        // Ensure visibility is properly set
        visibility: {
          skills: true,
          badges: true,
          stats: true,
          podsHistory: true
        }
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

// @desc    Debug endpoint to check database state
// @route   GET /api/profile/debug
// @access  Public
const debugProfiles = async (req, res) => {
  console.log('========== PROFILE DEBUG ENDPOINT ==========');
  
  try {
    // Count total users
    const totalUsers = await User.countDocuments();
    console.log('Total users in database:', totalUsers);
    
    // Count total profiles
    const totalProfiles = await Profile.countDocuments();
    console.log('Total profiles in database:', totalProfiles);
    
    // Get all users
    const allUsers = await User.find({}).select('_id name email role reputation');
    console.log('All users:', allUsers.map(u => ({ id: u._id, name: u.name, role: u.role })));
    
    // Get all profiles
    const allProfiles = await Profile.find({}).populate('user', 'name email role reputation');
    console.log('All profiles:', allProfiles.map(p => ({ 
      id: p._id, 
      user: p.user?.name, 
      displayName: p.displayName,
      skillsCount: p.skills?.length || 0,
      tier: p.experience?.tier
    })));
    
    // Find users without profiles
    const usersWithoutProfiles = [];
    for (const user of allUsers) {
      const hasProfile = await Profile.findOne({ user: user._id });
      if (!hasProfile) {
        usersWithoutProfiles.push(user);
      }
    }
    console.log('Users without profiles:', usersWithoutProfiles.map(u => u.name));
    
    res.json({
      summary: {
        totalUsers,
        totalProfiles,
        usersWithoutProfiles: usersWithoutProfiles.length,
        profileCoverage: `${Math.round((totalProfiles / totalUsers) * 100)}%`
      },
      users: allUsers,
      profiles: allProfiles.map(p => ({
        id: p._id,
        userName: p.user?.name,
        displayName: p.displayName,
        skillsCount: p.skills?.length || 0,
        tier: p.experience?.tier,
        hasVisibility: !!p.visibility
      })),
      usersWithoutProfiles: usersWithoutProfiles.map(u => ({ id: u._id, name: u.name, role: u.role }))
    });
  } catch (error) {
    console.error('Error in debugProfiles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create missing profiles for users
// @route   POST /api/profile/create-missing
// @access  Private (admin only - you might want to add admin check)
const createMissingProfiles = async (req, res) => {
  console.log('========== CREATING MISSING PROFILES ==========');
  
  try {
    // Get all users
    const allUsers = await User.find({});
    console.log(`Found ${allUsers.length} users`);
    
    const createdProfiles = [];
    
    for (const user of allUsers) {
      // Check if profile exists
      const existingProfile = await Profile.findOne({ user: user._id });
      
      if (!existingProfile) {
        console.log(`Creating profile for user: ${user.name}`);
        
        // Create default profile
        const newProfile = await Profile.create({
          user: user._id,
          displayName: user.name,
          skills: [
            {
              name: user.role === 'creator' ? 'Project Management' : 'Collaboration',
              level: 'intermediate',
              yearsExperience: 1
            }
          ],
          experience: {
            currentXP: 100,
            level: 1,
            tier: 'bronze'
          },
          visibility: {
            skills: true,
            badges: true,
            stats: true,
            podsHistory: true
          }
        });
        
        createdProfiles.push({
          userId: user._id,
          userName: user.name,
          profileId: newProfile._id
        });
      }
    }
    
    console.log(`Created ${createdProfiles.length} new profiles`);
    
    res.json({
      message: `Successfully created ${createdProfiles.length} missing profiles`,
      createdProfiles,
      totalUsers: allUsers.length,
      newProfileCount: createdProfiles.length
    });
  } catch (error) {
    console.error('Error in createMissingProfiles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Discover profiles with filtering and search (ENHANCED WITH DEBUGGING)
// @route   GET /api/profile/discover
// @access  Public (with enhanced features for authenticated users)
const discoverProfiles = async (req, res) => {
  console.log('========== DISCOVER PROFILES ENDPOINT ==========');
  console.log('Query parameters:', req.query);
  
  try {
    // Extract query parameters for filtering
    const { 
      search, 
      role, 
      tier, 
      skill, 
      experience,
      activity,
      sortBy,
      page = 1,
      limit = 20
    } = req.query;
    
    // DEBUGGING: First, let's get the raw data without filters
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    console.log(`Database has ${totalUsers} users and ${totalProfiles} profiles`);
    
    // Start with minimal filtering to see all profiles
    let baseQuery = {};
    let userQuery = {};
    
    // Only apply filters if they're explicitly set (not 'all' or empty)
    if (role && role !== 'all' && role !== '') {
      console.log(`Filtering by role: ${role}`);
      userQuery.role = role;
    }
    
    if (tier && tier !== 'all' && tier !== '') {
      console.log(`Filtering by tier: ${tier}`);
      baseQuery['experience.tier'] = tier;
    }
    
    if (skill && skill !== 'all' && skill !== '') {
      console.log(`Filtering by skill: ${skill}`);
      baseQuery['skills.name'] = { $regex: skill, $options: 'i' };
    }
    
    if (experience && experience !== 'all' && experience !== '') {
      console.log(`Filtering by experience: ${experience}`);
      baseQuery['skills.level'] = experience.toLowerCase();
    }
    
    // Handle search functionality
    if (search && search.trim() !== '') {
      console.log(`Searching for: ${search}`);
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      
      // Get users matching the search criteria
      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).select('_id');
      
      console.log(`Found ${matchingUsers.length} users matching search`);
      
      const userIds = matchingUsers.map(user => user._id);
      
      // Combine user search with profile field search
      const searchFilter = {
        $or: [
          { user: { $in: userIds } },
          { displayName: searchRegex },
          { headline: searchRegex },
          { bio: searchRegex },
          { 'skills.name': searchRegex }
        ]
      };
      
      baseQuery = { ...baseQuery, ...searchFilter };
    }
    
    console.log('Final base query:', JSON.stringify(baseQuery, null, 2));
    console.log('Final user query:', JSON.stringify(userQuery, null, 2));
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    console.log(`Pagination: page ${pageNum}, limit ${limitNum}, skip ${skip}`);
    
    let profiles;
    
    // If we're filtering by user properties
    if (Object.keys(userQuery).length > 0) {
      console.log('Filtering by user properties first...');
      
      // First get matching users
      const matchingUsers = await User.find(userQuery).select('_id');
      console.log(`Found ${matchingUsers.length} users matching user query`);
      
      const userIds = matchingUsers.map(user => user._id);
      
      // Then get profiles for those users
      profiles = await Profile.find({
        ...baseQuery,
        user: { $in: userIds }
      })
        .populate('user', ['name', 'email', 'role', 'reputation'])
        .skip(skip)
        .limit(limitNum)
        .lean(); // Use lean() for better performance
        
    } else {
      console.log('Getting profiles with base query only...');
      
      // Just get profiles based on profile filters
      profiles = await Profile.find(baseQuery)
        .populate('user', ['name', 'email', 'role', 'reputation'])
        .skip(skip)
        .limit(limitNum)
        .lean(); // Use lean() for better performance
    }
    
    console.log(`Found ${profiles.length} profiles after filtering and pagination`);
    
    // Log some details about found profiles
    if (profiles.length > 0) {
      console.log('Sample profiles found:');
      profiles.slice(0, 3).forEach((profile, index) => {
        console.log(`  ${index + 1}. ${profile.user?.name || 'Unknown'} (${profile.user?.role || 'Unknown role'}) - Skills: ${profile.skills?.length || 0}`);
      });
    }
    
    // Handle sorting
    if (sortBy) {
      console.log(`Sorting by: ${sortBy}`);
      
      switch(sortBy) {
        case 'reputation':
          profiles.sort((a, b) => (b.user?.reputation || 0) - (a.user?.reputation || 0));
          break;
        case 'experience':
          profiles.sort((a, b) => (b.experience?.currentXP || 0) - (a.experience?.currentXP || 0));
          break;
        case 'activity':
          profiles.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case 'skills':
          profiles.sort((a, b) => (b.skills?.length || 0) - (a.skills?.length || 0));
          break;
        default:
          // Default to reputation sorting
          profiles.sort((a, b) => (b.user?.reputation || 0) - (a.user?.reputation || 0));
      }
    } else {
      // Default sorting by reputation
      profiles.sort((a, b) => (b.user?.reputation || 0) - (a.user?.reputation || 0));
    }
    
    // If the user is authenticated, calculate personalized matches
    if (req.user) {
      console.log('Adding personalized match scores...');
      
      try {
        const userProfile = await Profile.findOne({ user: req.user.id });
        
        if (userProfile && userProfile.skills.length > 0) {
          const userSkills = userProfile.skills.map(skill => skill.name.toLowerCase());
          
          profiles.forEach(profile => {
            if (profile.skills && profile.skills.length > 0) {
              const profileSkills = profile.skills.map(skill => skill.name.toLowerCase());
              const matches = profileSkills.filter(skill => userSkills.includes(skill));
              const matchScore = Math.round((matches.length / Math.max(userSkills.length, 1)) * 100);
              profile.matchScore = matchScore;
            } else {
              profile.matchScore = 0;
            }
          });
          
          // Re-sort by skill match if requested
          if (sortBy === 'skillMatch') {
            profiles.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          }
        }
      } catch (matchError) {
        console.error('Error calculating match scores:', matchError);
        // Continue without match scores
      }
    }
    
    // Get total count for pagination info
    let totalCount;
    if (Object.keys(userQuery).length > 0) {
      const matchingUsers = await User.find(userQuery).select('_id');
      const userIds = matchingUsers.map(user => user._id);
      totalCount = await Profile.countDocuments({
        ...baseQuery,
        user: { $in: userIds }
      });
    } else {
      totalCount = await Profile.countDocuments(baseQuery);
    }
    
    console.log(`Total profiles matching criteria: ${totalCount}`);
    console.log(`Returning ${profiles.length} profiles for page ${pageNum}`);
    
    res.json({
      profiles,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNextPage: pageNum < Math.ceil(totalCount / limitNum),
        hasPrevPage: pageNum > 1
      }
    });
    
  } catch (error) {
    console.error('Error in discoverProfiles:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Get profile recommendations based on user interests and history
// @route   GET /api/profile/recommendations
// @access  Private
const getProfileRecommendations = async (req, res) => {
  console.log('getProfileRecommendations controller function called');
  
  try {
    // Get the current user's profile
    const userProfile = await Profile.findOne({ user: req.user.id });
    
    if (!userProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Get the user's skills
    const userSkills = userProfile.skills.map(skill => skill.name.toLowerCase());
    
    // Find pods the user is part of
    const userPods = await PodMember.find({ user: req.user.id }).select('pod');
    const podIds = userPods.map(member => member.pod);
    
    // Find other users in the same pods (potential collaborators)
    const podMembers = await PodMember.find({
      pod: { $in: podIds },
      user: { $ne: req.user.id }
    }).select('user');
    
    const collaboratorIds = [...new Set(podMembers.map(member => member.user.toString()))];
    
    // Find profiles with similar skills
    const skillMatchProfiles = await Profile.find({
      'skills.name': { $in: userSkills.map(skill => new RegExp(skill, 'i')) },
      user: { $ne: req.user.id }
    }).populate('user', ['name', 'role', 'reputation']).limit(10);
    
    // Find profiles of collaborators
    const collaboratorProfiles = await Profile.find({
      user: { $in: collaboratorIds }
    }).populate('user', ['name', 'role', 'reputation']);
    
    // Find profiles of top users in roles that complement the user's skills
    const complementaryProfiles = await Profile.find({
      user: { $ne: req.user.id },
      'user.role': req.user.role === 'creator' ? 'contributor' : 'creator'
    }).populate('user', ['name', 'role', 'reputation']).sort({ 'experience.currentXP': -1 }).limit(5);
    
    // Combine and deduplicate recommendations
    const allProfiles = [...skillMatchProfiles, ...collaboratorProfiles, ...complementaryProfiles];
    const uniqueProfiles = Array.from(new Map(allProfiles.map(profile => 
      [profile.user._id.toString(), profile]
    )).values());
    
    // Calculate match scores for each profile
    uniqueProfiles.forEach(profile => {
      // Calculate skill match score
      const profileSkills = profile.skills.map(skill => skill.name.toLowerCase());
      const matchingSkills = profileSkills.filter(skill => userSkills.includes(skill));
      const skillMatchScore = Math.round((matchingSkills.length / Math.max(userSkills.length, 1)) * 70);
      
      // Calculate collaboration score
      const isCollaborator = collaboratorIds.includes(profile.user._id.toString());
      const collaborationScore = isCollaborator ? 30 : 0;
      
      // Calculate total match score
      profile.matchScore = Math.min(skillMatchScore + collaborationScore, 100);
    });
    
    // Sort by match score
    uniqueProfiles.sort((a, b) => b.matchScore - a.matchScore);
    
    // Return top recommendations
    const recommendations = uniqueProfiles.slice(0, 10);
    console.log(`Returning ${recommendations.length} profile recommendations`);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error in getProfileRecommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profiles filtered by skill
// @route   GET /api/profile/skills/:skillName
// @access  Public
const getProfilesBySkill = async (req, res) => {
  console.log('getProfilesBySkill controller function called');
  
  const { skillName } = req.params;
  console.log('Skill name parameter:', skillName);
  
  try {
    // Find profiles with the specified skill
    const profiles = await Profile.find({
      'skills.name': { $regex: skillName, $options: 'i' }
    }).populate('user', ['name', 'role', 'reputation']);
    
    console.log(`Found ${profiles.length} profiles with skill: ${skillName}`);
    res.json(profiles);
  } catch (error) {
    console.error('Error in getProfilesBySkill:', error);
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
  getTopProfiles,
  discoverProfiles,
  getProfileRecommendations,
  getProfilesBySkill,
  debugProfiles,
  createMissingProfiles
};