const express = require('express');
const router = express.Router();
const { getGenerations, getGenerationById, deleteGeneration, saveFeedback } = require('../services/firestoreService');

// --- HISTORY ROUTES ---
router.get('/', async (req, res, next) => {
  try {
    const history = await getGenerations();
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const generation = await getGenerationById(req.params.id);
    if (!generation) {
      return res.status(404).json({ success: false, error: 'Generation not found' });
    }
    res.json({ success: true, data: generation });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const success = await deleteGeneration(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Generation not found' });
    }
    res.json({ success: true, message: 'Generation deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
