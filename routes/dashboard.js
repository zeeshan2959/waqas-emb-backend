const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Party = require('../models/Party');
const Payment = require('../models/Payment');
const PartyLedger = require('../models/PartyLedger');

// Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const totalCollections = await Collection.countDocuments();
    const totalParties = await Party.countDocuments();
    const totalPayments = await Payment.countDocuments();
    
    // Get payments from current month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: currentMonth },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: '$amount' }
        }
      }
    ]);

    // Get total yearly payments
    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearlyPayments = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $gte: yearStart },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          yearlyRevenue: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate pending payments
    const pendingPayments = await PartyLedger.aggregate([
      {
        $match: { type: 'debit' }
      },
      {
        $group: {
          _id: null,
          totalPending: { $sum: '$amount' }
        }
      }
    ]);

    const stats = {
      totalCollections,
      totalParties,
      totalPayments,
      pendingPayments: pendingPayments[0]?.totalPending || 0,
      monthlyRevenue: monthlyPayments[0]?.monthlyRevenue || 0,
      yearlyRevenue: yearlyPayments[0]?.yearlyRevenue || 0,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

module.exports = router;
