const Order = require('../models/order');
const BadRequestError = require('../erorrs/bad-request-error');
const OrderService = require('../services/OrderService');
const { concatenateErrorMessages } = require('../utils');

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

  OrderService.calculatePrice(list)
    .then((price) => {
      Order.create({ list, price, owner })
        .then((order) => {
          OrderService.updateStock(order);
          return res.json(order);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(concatenateErrorMessages(err)));
      else if (err.kind === 'ObjectId') next(new BadRequestError('invalid burger ids'));
      else next(err);
    });
};
