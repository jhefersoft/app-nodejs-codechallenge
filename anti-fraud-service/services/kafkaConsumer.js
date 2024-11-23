const { Kafka } = require('kafkajs');
const { produceMessage } = require('./kafkaProducer');

const kafka = new Kafka({ brokers: ['localhost:9092'] });

const initKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'anti-fraud-group' });
  await consumer.connect();
  console.log('Kafka Consumer connected');

  await consumer.subscribe({ topic: 'transactions-created', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const transaction = JSON.parse(message.value.toString());
      const status = transaction.value > 1000 ? 'rejected' : 'approved';

      console.log(`Processing transaction ${transaction.transactionExternalId}: ${status}`);

      // Send the updated status back to Kafka
      await produceMessage('transactions-status-updated', {
        transactionExternalId: transaction.transactionExternalId,
        status,
      });

      console.log(`Published updated status for transaction ${transaction.transactionExternalId}`); // Debug log
    },
  });
};

module.exports = { initKafkaConsumer };
