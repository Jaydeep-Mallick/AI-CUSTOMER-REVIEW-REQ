const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../services/firestoreService');

router.get('/', async (req, res, next) => {
  try {
    const data = await getAnalyticsData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
