const express = require('express');
const bodyParser = require('body-parser');
const transactionRoutes = require('./routes/transactionRoutes');
const { initKafkaProducer } = require('./services/kafkaProducer');
const { initKafkaConsumer } = require('./services/kafkaConsumer');
const { sequelize } = require('./models/transactionModel');
const { requestLogger } = require('../utils/middleware')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(requestLogger)
app.use('/api/transactions', transactionRoutes);

(async () => {
  // Sync database
  await sequelize.sync();

  // Initialize Kafka 
  await initKafkaProducer();
  await initKafkaConsumer();

  app.listen(PORT, () => console.log(`Transaction Service running on port ${PORT}`));
})();
