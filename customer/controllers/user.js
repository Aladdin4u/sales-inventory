const User = require("../models/User");
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
  await channel.assertQueue("wishlist", { exclusive: true });
  await channel.assertQueue("addtocart", { exclusive: true });
  await channel.assertQueue("removecart", { exclusive: true });
  await channel.assertQueue("order", { exclusive: true });
  console.log(` Waiting for messages in queue: wishlist, cart, order`);

  channel.bindQueue(
    "wishlist",
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_SERVICE
  );
  channel.bindQueue(
    "addtocart",
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_ADDTOCART
  );
  channel.bindQueue(
    "removecart",
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_REMOVECART
  );
  channel.bindQueue(
    "order",
    process.env.EXCHANGE_NAME,
    process.env.SHOPPING_ORDER
  );

  channel.consume(
    "wishlist",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, product } = JSON.parse(msg.content.toString());
        console.log("userrrr>", user);
        const profile = await User.findById(user);
        if (profile) {
          let wishlist = profile.wishlist;

          if (wishlist.length > 0) {
            let isExist = false;
            wishlist.map((item) => {
              if (item._id.toString() === product._id.toString()) {
                const index = wishlist.indexOf(item);
                wishlist.splice(index, 1);
                isExist = true;
              }
            });

            if (!isExist) {
              wishlist.push(product);
            }
          } else {
            wishlist.push(product);
          }

          profile.wishlist = wishlist;
          profile.save();
        }
      }
      console.log("[X] received wishlist");
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    "addtocart",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, data, qty } = JSON.parse(msg.content.toString());
        console.log("userrrr>", user);
        const profile = await User.findById(user);
        if (profile) {
          const cartItem = {
            product: data,
            unit: qty,
          };
          const isRemove = false;
          let cartItems = profile.cart;

          if (cartItems.length > 0) {
            let isExist = false;
            cartItems.map((item) => {
              if (item.product._id === data._id) {
                if (isRemove) {
                  cartItems.splice(cartItems.indexOf(item), 1);
                } else {
                  item.unit = qty;
                }
                isExist = true;
              }
            });

            if (!isExist) {
              cartItems.push(cartItem);
            }
          } else {
            cartItems.push(cartItem);
          }

          profile.cart = cartItems;

          profile.save();
        }
      }
      console.log("[X] received cart");
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    "removecart",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, data, qty } = JSON.parse(msg.content.toString());
        console.log("userrrr>", user);
        const profile = await User.findById(user);
        if (profile) {
          const cartItem = {
            product: data,
            unit: qty,
          };
          const isRemove = true;
          let cartItems = profile.cart;

          if (cartItems.length > 0) {
            let isExist = false;
            cartItems.map((item) => {
              if (item.product._id === data._id) {
                if (isRemove) {
                  cartItems.splice(cartItems.indexOf(item), 1);
                } else {
                  item.unit = qty;
                }
                isExist = true;
              }
            });

            if (!isExist) {
              cartItems.push(cartItem);
            }
          } else {
            cartItems.push(cartItem);
          }

          profile.cart = cartItems;

          profile.save();
        }
      }
      console.log("[X] received cart");
    },
    {
      noAck: true,
    }
  );
  channel.consume(
    "order",
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, orderResult } = JSON.parse(msg.content.toString());
        console.log("userrrr>", user);
        const profile = await User.findById(user);

        if(profile){ 
            
            if(profile.orders == undefined){
                profile.orders = []
            }
            profile.orders.push(orderResult);

            profile.cart = [];

            const profileResult = await profile.save();

            return profileResult;
        }
      }
      console.log("[X] received order");
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
    const user = req.id;
    try {
      const profile = await User.findById(user);
      const wishlist = SubscribeMessage(channel);
      console.log(wishlist);
      profile.wishlist.push(JSON.parse(wishlist));
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
