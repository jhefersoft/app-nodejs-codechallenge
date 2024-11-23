const { Kafka } = require('kafkajs');
const { Transaction } = require('../models/transactionModel');

const kafka = new Kafka({ brokers: ['localhost:9092'] });

const initKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'transaction-service-group' });
  await consumer.connect();
  console.log('Transaction Service Kafka Consumer connected');

  await consumer.subscribe({ topic: 'transactions-status-updated', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { transactionExternalId, status } = JSON.parse(message.value.toString());

      console.log(`Received status update for transaction ${transactionExternalId}: ${status}`);

      await Transaction.update({ status }, { where: { transactionExternalId } });

      console.log(`Updated transaction ${transactionExternalId} to status ${status}`);
    },
  });
};

module.exports = { initKafkaConsumer };
