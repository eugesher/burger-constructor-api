const Order = require('../models/order');
const Burger = require('../models/burger');
const BadRequestError = require('../erorrs/bad-request-error');
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

  function calculateOrderPrice() {
    return Burger.find({ _id: { $in: list } }).then((foundBurgers) => {
      const orderList = list.map((item) => foundBurgers.find((fb) => String(fb._id) === item));
      orderList.forEach((item) => {
        if (typeof item === 'undefined') throw new BadRequestError('some burgers not found');
      });
      return orderList.reduce((sum, current) => sum + current.price, 0);
    });
  }

  calculateOrderPrice()
    .then((price) => {
      Order.create({ list, price, owner }).then((burger) => res.json(burger));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(concatenateErrorMessages(err)));
      else if (err.kind === 'ObjectId') next(new BadRequestError('invalid burger ids'));
      else next(err);
    });
};
