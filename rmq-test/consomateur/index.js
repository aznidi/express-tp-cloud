const amqp = require("amqplib");

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'test_queue';

async function startConsumer() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    
    console.log('[Consumer] Waiting for messages from RabbitMQ...');
    
    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        console.log(`[Consumer] Received message: ${content}`);
        
        channel.ack(message);
      }
    });
    
    process.on('SIGINT', async () => {
      await channel.close();
      await connection.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('[Consumer] Error:', error);
  }
}

startConsumer();
