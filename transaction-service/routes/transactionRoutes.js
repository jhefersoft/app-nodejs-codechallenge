const express = require('express');
const { Transaction } = require('../models/transactionModel');
const { produceMessage } = require('../services/kafkaProducer');

const router = express.Router();

// Create Transaction
router.post('/', async (req, res) => {
  try {
    const transaction = await Transaction.create(req.body);

    // Send event to Kafka
    await produceMessage('transactions-created', transaction);

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

// Retrieve Transaction
router.get('/:transactionExternalId', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.transactionExternalId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving transaction' });
  }
});

module.exports = router;
