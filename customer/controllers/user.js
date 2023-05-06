const User = require("../models/User");
const amqplib = require("amqplib");
// const { CreateChannel, SubscribeMessage } = require("../utils/rabbitMQ");

let channel, connection;

const connectToRabbitMQ = async () => {
  connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
  channel = await connection.createChannel();
  await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
    durable: true,
  });
};
connectToRabbitMQ().then( async() => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, process.env.CUSTOMER_SERVICE);

  channel.consume(
    q.queue,
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, product} = JSON.parse(msg.content.toString())
        console.log("userrrr>", user)
        const profile = await User.findById(user)
        if(profile) {
          profile.wishlist.push(product)
          profile.save();
        }
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
});

module.exports = {
  createUser: async (req, res, next) => {
    const newUser = new User(req.body);

    try {
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
  addProductWishlist: async (req, res, next) => {
    const user = req.id
    try {
      const profile = await User.findById(user);
      const wishlist = SubscribeMessage(channel)
      console.log(wishlist)
      profile.wishlist.push(JSON.parse(wishlist))
      res.status(200).json(wishlist);
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (error) {
      next(error);
    }
  },
  getUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate("address");
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },
};
