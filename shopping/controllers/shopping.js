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
        const cart = await Cart.findOne({ customerId: user });

        const { _id } = data;
        const isRemove = false;

        if (cart) {
          let isExist = false;

          let cartItems = cart.items;

          if (cartItems.length > 0) {
            cartItems.map((item) => {
              if (item.product._id === _id) {
                if (isRemove) {
                  cartItems.splice(cartItems.indexOf(item), 1);
                } else {
                  item.unit = qty;
                }
                isExist = true;
              }
            });
          }

          if (!isExist && !isRemove) {
            cartItems.push({ product: { ...item }, unit: qty });
          }

          cart.items = cartItems;

          await cart.save();
        } else {
          await Cart.create({
            customerId: user,
            items: [{ product: { ...data }, unit: qty }],
          });
        }
      }
      console.log("[X] received cart");
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    "removecartshopping",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, data, qty } = JSON.parse(msg.content.toString());
        const cart = await Cart.findOne({ customerId: user });

        const { _id } = data;
        const isRemove = true;

        if (cart) {
          let isExist = false;

          let cartItems = cart.items;

          if (cartItems.length > 0) {
            cartItems.map((item) => {
              if (item.product._id === _id) {
                if (isRemove) {
                  cartItems.splice(cartItems.indexOf(item), 1);
                } else {
                  item.unit = qty;
                }
                isExist = true;
              }
            });
          }

          if (!isExist && !isRemove) {
            cartItems.push({ product: { ...item }, unit: qty });
          }

          cart.items = cartItems;

          await cart.save();
        } else {
          await Cart.create({
            customerId: user,
            items: [{ product: { ...data }, unit: qty }],
          });
        }
      }
      console.log("[X] received cart");
    },
    {
      noAck: true,
    }
  );
});

module.exports = {
  placeOrder: async (req, res, next) => {
    const user = req.user.id;
    let orderResult;
    try {
      const cart = await Cart.findOne({ customerId: user });
      if (cart) {
        let amount = 0;

        let cartItems = cart.items;

        if (cartItems.length > 0) {
          //process Order

          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = Math.random() * 4;

          const order = new Order({
            orderId: orderId,
            customerId: user,
            amount: amount,
            status: "received",
            items: cartItems,
          });

          cart.items = [];
          console.log(order)
          orderResult = await order.save();
          await cart.save();
        }
      }

      res.status(200).json(orderResult);
      channel.publish(process.env.EXCHANGE_NAME, process.env.SHOPPING_ORDER, Buffer.from(JSON.stringify({user, orderResult})))
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
  getCart: async (req, res, next) => {
    const user = req.user.id;
    try {
      const cart = await Cart.find({ customer: user });
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  },
  getOrder: async (req, res, next) => {
    const user = req.user.id;
    try {
      const order = await Order.find({ customer: user });
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  },
};
