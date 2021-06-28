const User = require('../models/user');

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send({ email: user.email });
    });
};

module.exports.createUser = (req, res) => {
  User.create({
    email: req.body.email,
  })
    .then((user) => res.send(user));
};
