const express = require('express');
const router = express.Router();
const PartyEdit = require('../models/PartyEdit');

// Get all party edits
router.get('/', async (req, res) => {
  try {
    const partyEdits = await PartyEdit.find().sort({ createdAt: -1 });
    res.json(partyEdits.map(p => ({ ...p.toObject(), id: p._id.toString() })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party edits', error: error.message });
  }
});

// Get single party edit
router.get('/:id', async (req, res) => {
  try {
    const partyEdit = await PartyEdit.findById(req.params.id);
    if (!partyEdit) {
      return res.status(404).json({ message: 'Party edit not found' });
    }
    res.json(partyEdit);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching party edit', error: error.message });
  }
});

// Create party edit
router.post('/', async (req, res) => {
  try {
    const partyEdit = new PartyEdit(req.body);
    const savedPartyEdit = await partyEdit.save();
    res.status(201).json({ ...savedPartyEdit.toObject(), id: savedPartyEdit._id.toString() });
  } catch (error) {
    res.status(400).json({ message: 'Error creating party edit', error: error.message });
  }
});

// Update party edit by MongoDB _id
router.patch('/:id', async (req, res) => {
  try {
    const partyEdit = await PartyEdit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!partyEdit) {
      return res.status(404).json({ message: 'Party edit not found' });
    }
    res.json({ ...partyEdit.toObject(), id: partyEdit._id.toString() });
  } catch (error) {
    res.status(400).json({ message: 'Error updating party edit', error: error.message });
  }
});

// Upsert party edit by lotId
router.put('/lot/:lotId', async (req, res) => {
  try {
    const { lotId } = req.params;
    const partyEdit = await PartyEdit.findOneAndUpdate(
      { lotId },
      { ...req.body, lotId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ ...partyEdit.toObject(), id: partyEdit._id.toString() });
  } catch (error) {
    res.status(400).json({ message: 'Error upserting party edit', error: error.message });
  }
});

// Delete party edit
router.delete('/:id', async (req, res) => {
  try {
    const partyEdit = await PartyEdit.findByIdAndDelete(req.params.id);
    if (!partyEdit) {
      return res.status(404).json({ message: 'Party edit not found' });
    }
    res.json({ message: 'Party edit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting party edit', error: error.message });
  }
});

module.exports = router;
