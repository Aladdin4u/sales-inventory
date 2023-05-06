const Cart = require("../models/Cart");
const Order = require("../models/Order");
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
connectToRabbitMQ().then(async () => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
    durable: true,
  });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(
    q.queue,
    process.env.EXCHANGE_NAME,
    process.env.SHOPPING_SERVICE
  );

  channel.consume(
    q.queue,
    async (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        const { user, product } = JSON.parse(msg.content.toString());
        console.log("userrrr>", user);
        const cart = await Cart.findById(user);
        if(cart){
                
          let isExist = false;

          let cartItems = cart.items;


          if(cartItems.length > 0){

              cartItems.map(item => {
                                          
                  if(item.product._id.toString() === _id.toString()){
                      if(isRemove){
                          cartItems.splice(cartItems.indexOf(item), 1);
                       }else{
                         item.unit = qty;
                      }
                       isExist = true;
                  }
              });
          } 
          
          if(!isExist && !isRemove){
              cartItems.push({product: { ...item}, unit: qty });
          }

          cart.items = cartItems;

          return await cart.save()

      }else{

         return await CartModel.create({
              customerId,
              items:[{product: { ...item}, unit: qty }]
          })
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
