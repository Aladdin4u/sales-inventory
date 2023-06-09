const amqplib = require("amqplib");

// const msg ="hello world"
module.exports.CreateChannel = async () => {
    try {
      const connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", { durable: true });
      return channel;
    } catch (err) {
      throw err;
    }
  };
  
  module.exports.PublishMessage = (channel, service, msg) => {
    channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
    console.log("Sent: ", msg);
  };
  
  