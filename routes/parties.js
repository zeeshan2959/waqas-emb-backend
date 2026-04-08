const express = require('express');
const router = express.Router();
const Party = require('../models/Party');

// Get all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find().sort({ name: 1 });
    res.json(parties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parties', error: error.message });
  }
});

// Get single party
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party', error: error.message });
  }
});

// Create party
router.post('/', async (req, res) => {
  try {
    const party = new Party(req.body);
    const savedParty = await party.save();
    res.status(201).json(savedParty);
  } catch (error) {
    res.status(400).json({ message: 'Error creating party', error: error.message });
  }
});

// Update party
router.patch('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json(party);
  } catch (error) {
    res.status(400).json({ message: 'Error updating party', error: error.message });
  }
});

// Delete party
router.delete('/:id', async (req, res) => {
  try {
    const party = await Party.findByIdAndDelete(req.params.id);
    if (!party) {
      return res.status(404).json({ message: 'Party not found' });
    }
    res.json({ message: 'Party deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting party', error: error.message });
  }
});

module.exports = router;
