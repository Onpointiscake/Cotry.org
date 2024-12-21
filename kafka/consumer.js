const Kafka = require('kafkajs').Kafka;

// Kafka Consumer
const kafka = new Kafka({
  clientId: 'like-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'like-consumer-group' });

async function startConsumer(updateLikeCount) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'post-likes', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { user_id, action, timestamp } = JSON.parse(message.value.toString());
      const post_id = message.key.toString();

      console.log(`Processing like event for post ${post_id} by user ${user_id}`);
      await updateLikeCount(post_id, user_id, action);
    },
  });
}

module.exports = { startConsumer };