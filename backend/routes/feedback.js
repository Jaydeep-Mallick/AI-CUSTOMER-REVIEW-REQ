const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { saveFeedback } = require('../services/firestoreService');

router.post('/', 
  [
    body('generationId').notEmpty().withMessage('Generation ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  ],
  async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const feedback = await saveFeedback(req.body);
    res.json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
