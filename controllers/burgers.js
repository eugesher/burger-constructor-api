const Burger = require('../models/burger');
const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const ForbiddenError = require('../erorrs/forbidden-error');
const NotFoundError = require('../erorrs/not-found-error');
const { concatenateErrorMessages, validateBurgerComposition } = require('../utils');

module.exports.getBurgers = (req, res, next) => {
  const owner = req.user._id;

  Burger.find({ owner })
    .populate('ingredients')
    .then((burgers) => res.json(burgers))
    .catch(next);
};

module.exports.saveBurger = (req, res, next) => {
  const { name, ingredients } = req.body;
  const owner = req.user._id;

  function calculateBurgerPrice() {
    return Ingredient.find({ _id: { $in: ingredients } }).then((foundIngredients) => {
      const burgerIngredients = ingredients.map(
        (i) => foundIngredients.find((fi) => String(fi._id) === i),
      );

      burgerIngredients.forEach((item) => {
        if (typeof item === 'undefined') throw new BadRequestError('some ingredients not found');
      });
      validateBurgerComposition(burgerIngredients);
      return burgerIngredients.reduce((sum, current) => sum + current.price, 0);
    });
  }

  calculateBurgerPrice()
    .then((price) => {
      Burger.create({
        name,
        ingredients,
        price,
        owner,
      })
        .then((burger) => res.json(burger));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(concatenateErrorMessages(err)));
      else if (err.kind === 'ObjectId') next(new BadRequestError('invalid ingredient ids'));
      else next(err);
    });
};

module.exports.deleteBurger = (req, res, next) => {
  const { burgerId } = req.params;
  const userId = req.user._id;

  Burger.findById(burgerId)
    .then((burger) => {
      if (burger) {
        if (burger.owner.equals(userId)) {
          Burger.findByIdAndRemove(burgerId).then((removedBurger) => res.send(removedBurger));
        } else {
          throw new ForbiddenError('only your burgers are allowed to delete');
        }
      } else {
        throw new NotFoundError('burger not found');
      }
    })
    .catch((err) => next(err.kind === 'ObjectId' ? new BadRequestError('invalid burger id') : err));
};
