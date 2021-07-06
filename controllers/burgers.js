const Burger = require('../models/burger');
const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const ForbiddenError = require('../erorrs/forbidden-error');
const NotFoundError = require('../erorrs/not-found-error');
const { concatenateErrorMessages } = require('../utils');

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

  function validateBurgerComposition() {
    const bunsLength = ingredients.filter((i) => i.category === 'buns').length;
    const cutletsLength = ingredients.filter((i) => i.category === 'cutlets').length;
    const cheesesLength = ingredients.filter((i) => i.category === 'cheeses').length;
    const vegetablesLength = ingredients.filter((i) => i.category === 'vegetables').length;
    const saucesLength = ingredients.filter((i) => i.category === 'sauces').length;

    if (!bunsLength) {
      throw new BadRequestError('burger must contain a bun');
    }
    if (bunsLength > 1) {
      throw new BadRequestError('there should only be one bun in a burger');
    }
    if (cutletsLength > 2) {
      throw new BadRequestError('burger should not contain more than 2 cutlets');
    }
    if (cheesesLength > 2) {
      throw new BadRequestError('burger should not contain more than 2 servings of cheese');
    }
    if (vegetablesLength > 3) {
      throw new BadRequestError('burger should not contain more than 3 servings of vegetable');
    }
    if (saucesLength > 3) {
      throw new BadRequestError('burger should not contain more than 3 servings of sauce');
    }
  }

  function calculateBurgerPrice() {
    return Ingredient.find({ _id: { $in: ingredients } })
      .then((foundIngredients) => {
        if (foundIngredients.length !== ingredients.length) {
          throw new BadRequestError('some ingredients not found');
        }
        validateBurgerComposition();
        return foundIngredients.reduce((sum, current) => sum + current.price, 0);
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
        .then((burger) => res.json(burger))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(concatenateErrorMessages(err)));
      else if (err.kind === 'ObjectId') next(new BadRequestError('invalid ingredients id'));
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
          Burger.findByIdAndRemove(burgerId)
            .then((removedBurger) => res.send(removedBurger));
        } else {
          throw new ForbiddenError('only your burgers are allowed to delete');
        }
      } else {
        throw new NotFoundError('burger not found');
      }
    })
    .catch((err) => next(
      err.kind === 'ObjectId'
        ? new BadRequestError('invalid burger id')
        : err,
    ));
};
