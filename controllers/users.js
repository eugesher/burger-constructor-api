const UserService = require('../services/UserService');

module.exports.getCurrentUser = (req, res, next) => {
  const service = new UserService(res, next);
  const { _id } = req.user;

  service.getInfo(_id);
};

module.exports.login = (req, res, next) => {
  const service = new UserService(res, next);
  const { email, password } = req.body;

  service.login(email, password);
};

module.exports.createUser = (req, res, next) => {
  const service = new UserService(res, next);
  const { email, password } = req.body;

  service.register(email, password);
};
