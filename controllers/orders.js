const Order = require('../models/order');
const OrderService = require('../services/OrderService');

module.exports.getOrders = (req, res, next) => {
  const owner = req.user._id;

  Order.find({ owner })
    .populate('list')
    .then((order) => res.json(order))
    .catch(next);
};

module.exports.makeOrder = (req, res, next) => {
  const { list } = req.body;
  const owner = req.user._id;

  OrderService.getIngredients(list)
    .then(OrderService.updateStock)
    .then(() => OrderService.calculatePrice(list))
    .then((price) => Order.create({ list, price, owner }))
    .then((order) => res.json(order))
    .catch(next);
};
