const { NODE_ENV, JWT_SECRET, SALT_LENGTH } = process.env;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../erorrs/not-found-error');
const BadRequestError = require('../erorrs/bad-request-error');
const ConflictError = require('../erorrs/conflict-error');
const { concatenateErrorMessages } = require('../utils');

class UserService {
  constructor(res, next) {
    this.res = res;
    this.next = next;
  }

  getInfo(id) {
    User.findById(id)
      .then((user) => {
        if (user) this.res.json(user);
        else throw new NotFoundError('user not found');
      })
      .catch((err) => this.next(err.kind === 'ObjectId' ? new BadRequestError('invalid user id') : err));
  }

  login(email, password) {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-key',
          { expiresIn: '7d' },
        );
        this.res.json({ token });
      })
      .catch((err) => {
        const { message } = err;
        this.res.status(401).json({ message });
        this.next(err);
      });
  }

  register(email, password) {
    if (!email || !password) {
      throw new BadRequestError('missing email or password ');
    }

    bcrypt
      .hash(password, Number(SALT_LENGTH))
      .then((hashedPassword) => User.create({
        email,
        password: hashedPassword,
      }))
      .then((user) => {
        const u = user.toObject();
        delete u.password;
        this.res.json(u);
      })
      .catch((err) => {
        if (err.code === 11000) {
          this.next(new ConflictError('email has already been registered'));
        } else if (err.name === 'ValidationError') {
          this.next(new BadRequestError(concatenateErrorMessages(err)));
        } else {
          this.next(err);
        }
      });
  }
}

module.exports = UserService;
