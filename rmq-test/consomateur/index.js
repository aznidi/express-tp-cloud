const amqp = require("amqplib");

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'test_queue';

async function startConsumer() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Make sure the queue exists
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    
    console.log('[Consumer] Waiting for messages from RabbitMQ...');
    
    // Start consuming messages
    channel.consume(QUEUE_NAME, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        console.log(`[Consumer] Received message: ${content}`);
        
        // Acknowledge the message was received and processed
        channel.ack(message);
      }
    });
    
    // Handle connection close
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
