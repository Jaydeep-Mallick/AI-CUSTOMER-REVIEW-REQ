const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const { generateMessage } = require('../services/geminiService');
const { saveGeneration } = require('../services/firestoreService');

// Basic validation rules
const validateGenerationRequest = [
  body('customerName').notEmpty().withMessage('Customer Name is required'),
  body('tripType').notEmpty().withMessage('Trip Type is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('reviewLink').optional({ checkFalsy: true }).isURL().withMessage('Review Link must be a valid URL'),
];

router.post('/', validateGenerationRequest, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const formData = req.body;
    
    // 1. Generate message using Gemini
    const generatedText = await generateMessage(formData);
    
    // 2. Save to Firestore (or mock DB if not configured)
    const savedRecord = await saveGeneration({
      ...formData,
      generatedMessage: generatedText,
    });

    // 3. Return response
    res.json({
      success: true,
      data: savedRecord
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
