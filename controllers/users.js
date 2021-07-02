const User = require('../models/user');
const NotFoundError = require('../erorrs/not-found-error');
const BadRequestError = require('../erorrs/bad-request-error');

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (user) res.json(user);
      else throw new NotFoundError('user not found');
    })
    .catch((err) => next(
      err.kind === 'ObjectId'
        ? new BadRequestError('invalid user id')
        : err,
    ));
};

module.exports.createUser = (req, res, next) => {
  const { email } = req.body;

  User.create({ email })
    .then((user) => res.json(user))
    .catch(next);
};
