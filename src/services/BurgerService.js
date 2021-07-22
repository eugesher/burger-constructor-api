const Ingredient = require('../models/ingredient');
const Burger = require('../models/burger');
const NotFoundError = require('../erorrs/not-found-error');
const ForbiddenError = require('../erorrs/forbidden-error');
const BadRequestError = require('../erorrs/bad-request-error');
const { burgerIngredientLimits: limits, concatenateErrorMessages: concatErrs } = require('../utils');

function validateBurgerComposition(burgerIngredients) {
  const categoryAmount = (category) => burgerIngredients.filter(
    (bi) => bi.category === category,
  ).length;

  const isBunsCorrect = categoryAmount('buns') === limits.buns;
  const isCutletsCorrect = categoryAmount('cutlets') <= limits.cutlets;
  const isCheesesCorrect = categoryAmount('cheeses') <= limits.cheeses;
  const isVegetablesCorrect = categoryAmount('vegetables') <= limits.vegetables;
  const isSaucesCorrect = categoryAmount('sauces') <= limits.sauces;
  const isBaconCorrect = categoryAmount('bacon') <= limits.bacon;

  if (
    isBunsCorrect
    && isCutletsCorrect
    && isCheesesCorrect
    && isVegetablesCorrect
    && isSaucesCorrect
    && isBaconCorrect
  ) return;

  if (!isBunsCorrect) throw new BadRequestError('burger must contain 1 bun');
  if (!isCutletsCorrect) throw new BadRequestError('burger should not contain more than 2 cutlets');
  if (!isCheesesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of cheese');
  if (!isVegetablesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of vegetable');
  if (!isSaucesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of sauce');
  if (!isBaconCorrect) throw new BadRequestError('burger should not contain more than 1 servings of bacon');
}

class BurgerService {
  constructor(res, next) {
    this.res = res;
    this.next = next;
  }

  findUserBurgers(owner) {
    Burger.find({ owner })
      .populate('ingredients')
      .then((burgers) => this.res.json(burgers))
      .catch(this.next);
  }

  calculatePrice(ingredients) {
    return Ingredient.find({ _id: { $in: ingredients } })
      .then((foundIngredients) => {
        const burgerIngredients = ingredients.map(
          (i) => foundIngredients.find((fi) => String(fi._id) === i),
        );

        burgerIngredients.forEach((item) => {
          if (typeof item === 'undefined') throw new BadRequestError('some ingredients not found');
        });
        validateBurgerComposition(burgerIngredients);
        return burgerIngredients.reduce((sum, current) => sum + current.price, 0);
      })
      .catch(this.next);
  }

  save(name, ingredients, price, owner) {
    Burger.create({
      name, ingredients, price, owner,
    })
      .then((burger) => this.res.json(burger))
      .catch((err) => {
        if (err.name === 'ValidationError') this.next(new BadRequestError(concatErrs(err)));
        else if (err.kind === 'ObjectId') this.next(new BadRequestError('invalid ingredient ids'));
        else this.next(err);
      });
  }

  delete(burgerId, userId) {
    Burger.findById(burgerId)
      .then((burger) => {
        if (!burger) throw new NotFoundError('burger not found');
        if (!burger.owner.equals(userId)) throw new ForbiddenError('only your burgers are allowed to delete');
        return Burger.findByIdAndRemove(burgerId);
      })
      .then((removedBurger) => this.res.json(removedBurger))
      .catch((err) => this.next(err.kind === 'ObjectId' ? new BadRequestError('invalid burger id') : err));
  }
}

module.exports = BurgerService;
