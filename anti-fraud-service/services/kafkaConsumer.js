const { Kafka } = require('kafkajs');
const { produceMessage } = require('./kafkaProducer');

const kafka = new Kafka({ brokers: ['localhost:9092'] });

const initKafkaConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'anti-fraud-group' });
  await consumer.connect();
  await consumer.subscribe({ topic: 'transactions-created', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const transaction = JSON.parse(message.value.toString());
      const status = transaction.value > 1000 ? 'rejected' : 'approved';

      await produceMessage('transactions-status-updated', {
        transactionExternalId: transaction.transactionExternalId,
        status,
      });

    },
  });
};

module.exports = { initKafkaConsumer };
