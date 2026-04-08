const express = require('express');
const router = express.Router();
const SavedDesign = require('../models/SavedDesign');

// Get all saved designs
router.get('/', async (req, res) => {
  try {
    const designs = await SavedDesign.find().sort({ createdAt: -1 });
    const normalized = designs.map(d => ({
      ...d.toObject(),
      id: d._id.toString(),
    }));
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved designs', error: error.message });
  }
});

// Get single saved design
router.get('/:id', async (req, res) => {
  try {
    const design = await SavedDesign.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Saved design not found' });
    }
    res.json({ ...design.toObject(), id: design._id.toString() });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved design', error: error.message });
  }
});

// Create saved design
router.post('/', async (req, res) => {
  try {
    const design = new SavedDesign(req.body);
    const saved = await design.save();
    res.status(201).json({ ...saved.toObject(), id: saved._id.toString() });
  } catch (error) {
    res.status(400).json({ message: 'Error creating saved design', error: error.message });
  }
});

// Update saved design
router.patch('/:id', async (req, res) => {
  try {
    const design = await SavedDesign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!design) {
      return res.status(404).json({ message: 'Saved design not found' });
    }
    res.json({ ...design.toObject(), id: design._id.toString() });
  } catch (error) {
    res.status(400).json({ message: 'Error updating saved design', error: error.message });
  }
});

// Delete saved design
router.delete('/:id', async (req, res) => {
  try {
    const design = await SavedDesign.findByIdAndDelete(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Saved design not found' });
    }
    res.json({ message: 'Saved design deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting saved design', error: error.message });
  }
});

module.exports = router;
