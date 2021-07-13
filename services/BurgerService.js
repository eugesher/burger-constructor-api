const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const { burgerIngredientLimits: limits } = require('../utils');

function validateBurgerComposition(burgerIngredients) {
  const categoryAmount = (category) => burgerIngredients.filter(
    (bi) => bi.category === category,
  ).length;

  const isBunsCorrect = categoryAmount('buns') === limits.buns;
  const isCutletsCorrect = categoryAmount('cutlets') <= limits.cutlets;
  const isCheesesCorrect = categoryAmount('cheeses') <= limits.cheeses;
  const isVegetablesCorrect = categoryAmount('vegetables') <= limits.vegetables;
  const isSaucesCorrect = categoryAmount('sauces') <= limits.sauces;

  if (
    isBunsCorrect
    && isCutletsCorrect
    && isCheesesCorrect
    && isVegetablesCorrect
    && isSaucesCorrect
  ) return;

  if (!isBunsCorrect) throw new BadRequestError('burger must contain 1 bun');
  if (!isCutletsCorrect) throw new BadRequestError('burger should not contain more than 2 cutlets');
  if (!isCheesesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of cheese');
  if (!isVegetablesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of vegetable');
  if (!isSaucesCorrect) throw new BadRequestError('burger should not contain more than 3 servings of sauce');
}

class BurgerService {
  static calculatePrice(ingredients) {
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
}

module.exports = BurgerService;
