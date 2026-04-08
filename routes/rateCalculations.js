const express = require('express');
const router = express.Router();
const RateCalculation = require('../models/RateCalculation');

// Get all rate calculations
router.get('/', async (req, res) => {
  try {
    const calculations = await RateCalculation.find().sort({ calculationDate: -1 });
    res.json(calculations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calculations', error: error.message });
  }
});

// Create rate calculation
router.post('/', async (req, res) => {
  try {
    const calculation = new RateCalculation(req.body);
    const savedCalculation = await calculation.save();
    res.status(201).json(savedCalculation);
  } catch (error) {
    res.status(400).json({ message: 'Error creating calculation', error: error.message });
  }
});

// Update rate calculation
router.patch('/:id', async (req, res) => {
  try {
    const calculation = await RateCalculation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!calculation) {
      return res.status(404).json({ message: 'Calculation not found' });
    }
    res.json(calculation);
  } catch (error) {
    res.status(400).json({ message: 'Error updating calculation', error: error.message });
  }
});

module.exports = router;
