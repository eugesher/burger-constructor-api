const Bun = require('../models/bun');

module.exports.getBuns = (req, res) => {
  Bun.find()
    .then((buns) => res.json(buns));
};

module.exports.addNewBun = (req, res) => {
  const { name, quantity, price } = req.body;
  Bun.create({ name, quantity, price })
    .then((bun) => res.send(bun));
};

module.exports.removeBun = (req, res) => {
  const { bunId } = req.params;
  Bun.findByIdAndRemove(bunId)
    .then((removedBun) => res.send(removedBun));
};

module.exports.setBunsQuantity = (req, res) => {
  const { quantity } = req.body;
  Bun.findByIdAndUpdate(req.bun._id, { quantity }, { new: true })
    .then((bun) => res.send(bun));
};
