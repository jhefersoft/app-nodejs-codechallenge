const { Kafka } = require('kafkajs');

let producer;

const kafka = new Kafka({ brokers: ['localhost:9092'] });

const initKafkaProducer = async () => {
  producer = kafka.producer();
  await producer.connect();
  console.log('Kafka Producer connected');
};

const produceMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};

module.exports = { initKafkaProducer, produceMessage };
