const express = require('express');
const router = express.Router();

// Basic route to test API
router.get('/', (req, res) => {
  res.send('PODNEX API is running...');
});

module.exports = router;
