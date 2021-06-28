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
  })
    .then((burger) => res.send(burger));
};

module.exports.deleteBurger = (req, res) => {
  const { burgerId } = req.params;
  Burger.findById(burgerId)
    .then(() => {
      Burger.findByIdAndRemove(burgerId).then((removedBurger) => {
        res.send(removedBurger);
      });
    });
};
