const User = require('../models/user');

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.json(user));
};

module.exports.createUser = (req, res) => {
  User.create({ email: req.body.email })
    .then((user) => res.json(user));
};
