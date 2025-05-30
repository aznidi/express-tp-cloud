const amqp = require("amqplib");

const RABBITMQ_URL = 'amqp://localhost';
const QUEUE_NAME = 'test_queue';

async function sendMessage(message) {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await channel.assertQueue(QUEUE_NAME, { durable: false });
    
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    
    console.log(`[Producer] Message sent to RabbitMQ: ${JSON.stringify(message)}`);
    
    setTimeout(async () => {
      await channel.close();
      await connection.close();
    }, 500);
  } catch (error) {
    console.error('[Producer] Error:', error);
  }
}

sendMessage({ text: "Hello from producer!", timestamp: new Date().toISOString() });

setInterval(() => {
  sendMessage({ 
    text: "Periodic test message", 
    timestamp: new Date().toISOString() 
  });
}, 5000);
