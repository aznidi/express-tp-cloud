const amqp = require("amqplib");

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'test_queue';

async function sendMessage(message) {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    // Make sure the queue exists
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    
    // Send the message
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    
    console.log(`[Producer] Message sent to RabbitMQ: ${JSON.stringify(message)}`);
    
    // Close the connection
    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.error('[Producer] Error:', error);
  }
}

// Example: send a test message
sendMessage({ text: "Hello from producer!", timestamp: new Date().toISOString() });

// Send additional messages every 5 seconds
setInterval(() => {
  sendMessage({ 
    text: "Periodic test message", 
    timestamp: new Date().toISOString() 
  });
}, 5000);
