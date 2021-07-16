const OrderService = require('../services/OrderService');

module.exports.getOrders = (req, res, next) => {
  const service = new OrderService(res, next);
  const owner = req.user._id;

  service.findUserOrders(owner);
};

module.exports.makeOrder = (req, res, next) => {
  const service = new OrderService(res, next);
  const { list } = req.body;
  const owner = req.user._id;

  service.getIngredients(list)
    .then(service.updateStock)
    .then(() => service.calculatePrice(list))
    .then((price) => service.makeOrder(list, price, owner));
};
