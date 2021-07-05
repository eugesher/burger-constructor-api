const Ingredient = require('../models/ingredient');
const BadRequestError = require('../erorrs/bad-request-error');
const { concatenateErrorMessages } = require('../utils');

module.exports.getIngredients = (req, res, next) => {
  const { params } = req;
  const { category } = params;

  Ingredient.find(category && params)
    .then((ingredients) => res.json(ingredients))
    .catch(next);
};

module.exports.addNewIngredient = (req, res, next) => {
  const {
    name, category, quantity, price,
  } = req.body;

  Ingredient.create({
    name, category, quantity, price,
  })
    .then((ingredient) => res.json(ingredient))
    .catch((err) => next(
      err.name === 'ValidationError'
        ? new BadRequestError(concatenateErrorMessages(err))
        : err,
    ));
};

module.exports.removeIngredient = (req, res, next) => {
  const { ingredientId } = req.params;

  Ingredient.findByIdAndRemove(ingredientId)
    .then((removedIngredient) => {
      if (removedIngredient) res.json(removedIngredient);
      else throw new BadRequestError('ingredient not found');
    })
    .catch((err) => next(
      err.kind === 'ObjectId'
        ? new BadRequestError('invalid ingredient id')
        : err,
    ));
};

module.exports.setIngredientsQuantity = (req, res, next) => {
  const { ingredientId } = req.params;
  const { quantity } = req.body;

  Ingredient.findByIdAndUpdate(ingredientId, { quantity }, { new: true })
    .then((ingredient) => res.json(ingredient))
    .catch((err) => next(
      err.name === 'ValidationError'
        ? new BadRequestError(concatenateErrorMessages(err))
        : err,
    ));
};
