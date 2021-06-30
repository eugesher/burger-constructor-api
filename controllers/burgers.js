const Burger = require('../models/burger');

module.exports.getBurgers = (req, res) => {
  Burger.find({ owner: req.user._id })
    .then((burgers) => res.send(burgers));
};

module.exports.saveBurger = (req, res) => {
  Burger.create({
    bun: req.body.bun,
    filling: req.body.filling,
    owner: req.user._id,
    price: req.body.price,
  })
    .then((burger) => res.send(burger));
};

module.exports.deleteBurger = (req, res) => {
  Burger.findByIdAndRemove(req.params.burgerId)
    .then((removedBurger) => res.send(removedBurger));
};
