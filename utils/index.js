const BadRequestError = require('../erorrs/bad-request-error');

const schemaOptions = { toJSON: { getters: true }, id: false };
const burgerIngredientLimits = {
  buns: 1,
  cutlets: 2,
  cheeses: 2,
  vegetables: 3,
  sauces: 3,
};

function getPrice(value) {
  return Number((value / 100).toFixed(2));
}

function setPrice(value) {
  return Math.ceil(value * 100);
}

function setName(value) {
  return value.trim().toLowerCase();
}

function concatenateErrorMessages(err) {
  return Object.values(err.errors).map((e) => e.message).join('. ');
}

function validateBurgerComposition(burgerIngredients) {
  const bunsCorrect = burgerIngredients.filter((i) => i.category === 'buns')
    .length === burgerIngredientLimits.buns;
  const cutletsCorrect = burgerIngredients.filter((i) => i.category === 'cutlets')
    .length <= burgerIngredientLimits.cutlets;
  const cheesesCorrect = burgerIngredients.filter((i) => i.category === 'cheeses')
    .length <= burgerIngredientLimits.cheeses;
  const vegetablesCorrect = burgerIngredients.filter((i) => i.category === 'vegetables')
    .length <= burgerIngredientLimits.vegetables;
  const saucesCorrect = burgerIngredients.filter((i) => i.category === 'sauces')
    .length <= burgerIngredientLimits.sauces;

  if (
    bunsCorrect && cutletsCorrect && cheesesCorrect && vegetablesCorrect && saucesCorrect
  ) return;

  if (!bunsCorrect) {
    throw new BadRequestError('burger must contain 1 bun');
  }
  if (!cutletsCorrect) {
    throw new BadRequestError('burger should not contain more than 2 cutlets');
  }
  if (!cheesesCorrect) {
    throw new BadRequestError('burger should not contain more than 2 servings of cheese');
  }
  if (!vegetablesCorrect) {
    throw new BadRequestError('burger should not contain more than 3 servings of vegetable');
  }
  if (!saucesCorrect) {
    throw new BadRequestError('burger should not contain more than 3 servings of sauce');
  }
}

module.exports = {
  schemaOptions,
  burgerIngredientLimits,
  getPrice,
  setPrice,
  setName,
  concatenateErrorMessages,
  validateBurgerComposition,
};
