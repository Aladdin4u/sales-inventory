const Cart = require("../models/Cart");
const Order = require("../models/Order");
const amqplib = require("amqplib");
// const { CreateChannel, SubscribeMessage } = require("../utils/rabbitMQ");

let channel, connection;

const connectToRabbitMQ = async () => {
  connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
  channel = await connection.createChannel();
};
connectToRabbitMQ().then(async () => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
    durable: true,
  });
  await channel.assertQueue("addtocartshopping", { exclusive: true });
  await channel.assertQueue("removecartshopping", { exclusive: true });
  console.log(` Waiting for messages in queue: wishlist, cart, order`);

  channel.bindQueue(
    "addtocartshopping",
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_ADDTOCART
  );
  channel.bindQueue(
    "removecartshopping",
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_REMOVECART
  );

  channel.consume(
    "addtocartshopping",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, data, qty } = JSON.parse(msg.content.toString());
        const newCart = new Cart({
            customerId: user,
            items: [{ product: { ...data }, unit: qty }],
          });
          await newCart.save()
      }
      console.log("[X] received cart");
    },
    {
      noAck: true,
    }
  );
});

module.exports = {
  createShopping: async (req, res, next) => {
    const newCart = new Cart(req.body);

    try {
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } catch (error) {
      next(error);
    }
  },
  updateShopping: async (req, res, next) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (error) {
      next(error);
    }
  },
  deleteShopping: async (req, res, next) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json("Cart has been deleted");
    } catch (error) {
      next(error);
    }
  },
  getShopping: async (req, res, next) => {
    try {
      const Cart = await Cart.findById(req.params.id).populate("address");
      res.status(200).json(Cart);
    } catch (error) {
      next(error);
    }
  },
  getAllShoppings: async (req, res, next) => {
    try {
      const Carts = await Cart.find();
      res.status(200).json(Carts);
    } catch (error) {
      next(error);
    }
  },
};
