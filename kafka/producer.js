const Kafka = require('kafkajs').Kafka;

// Kafka Producer
const kafka = new Kafka({
  clientId: 'like-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function sendLikeEvent(postId, userId, timestamp) {
  await producer.connect();
  await producer.send({
    topic: 'post-likes',
    messages: [
      {
        key: postId,
        value: JSON.stringify({
          user_id: userId,
          action: true, // "like" action
          timestamp,
        }),
      },
    ],
  });
  console.log(`Like event sent for post ${postId} by user ${userId}`);
}

module.exports = { sendLikeEvent };