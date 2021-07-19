const BurgerService = require('../services/BurgerService');

module.exports.getBurgers = (req, res, next) => {
  const service = new BurgerService(res, next);
  const owner = req.user._id;

  service.findUserBurgers(owner);
};

module.exports.saveBurger = (req, res, next) => {
  const service = new BurgerService(res, next);
  const { name, ingredients } = req.body;
  const owner = req.user._id;

  service.calculatePrice(ingredients)
    .then((price) => service.save(name, ingredients, price, owner));
};

module.exports.deleteBurger = (req, res, next) => {
  const service = new BurgerService(res, next);
  const { burgerId } = req.params;
  const userId = req.user._id;

  service.delete(burgerId, userId);
};
