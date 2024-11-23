const { initKafkaConsumer } = require('./services/kafkaConsumer');
const { initKafkaProducer } = require('./services/kafkaProducer');


(async () => {
  await initKafkaConsumer();
  await initKafkaProducer();
})();
