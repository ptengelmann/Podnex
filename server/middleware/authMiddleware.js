const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  console.log('===== AUTH MIDDLEWARE CALLED =====');
  console.log('URL:', req.originalUrl);
  console.log('Method:', req.method);
  console.log('Headers present:', Object.keys(req.headers));
  console.log('Auth header exists:', !!req.headers.authorization);
  
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token ? `YES (length: ${token.length})` : 'NO');
  }
  
  // If no token found
  if (!token) {
    console.log('No token found, returning 401');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'EXISTS' : 'MISSING');
    console.log('Verifying token...');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully, user ID:', decoded.id);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('User not found in database for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }
    
    console.log('User found:', user.name, 'Role:', user.role, 'ID:', user._id);
    req.user = user;
    console.log('=== AUTH MIDDLEWARE SUCCESS ===');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    console.error('Error details:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };