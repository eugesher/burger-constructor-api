const Burger = require('../models/burger');
const BadRequestError = require('../erorrs/bad-request-error');
const { concatenateErrorMessages } = require('../utils');

module.exports.getBurgers = (req, res, next) => {
  const owner = req.user._id;

  Burger.find({ owner })
    .then((burgers) => res.json(burgers))
    .catch(next);
};

module.exports.saveBurger = (req, res, next) => {
  const { name, ingredients, price } = req.body;
  const owner = req.user._id;

  Burger.create({
    name, ingredients, price, owner,
  })
    .then((burger) => res.json(burger))
    .catch(next);
};

module.exports.deleteBurger = (req, res, next) => {
  Burger.findByIdAndRemove(req.params.burgerId)
    .then((removedBurger) => res.json(removedBurger))
    .catch((err) => next(
      err.name === 'ValidationError'
        ? new BadRequestError(concatenateErrorMessages(err))
        : err,
    ));
};
