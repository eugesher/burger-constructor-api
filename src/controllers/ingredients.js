const IngredientService = require('../services/IngredientsService');

module.exports.getIngredients = (req, res, next) => {
  const service = new IngredientService(res, next);
  const { params } = req;

  service.getAll(params);
};

module.exports.addNewIngredient = (req, res, next) => {
  const service = new IngredientService(res, next);
  const {
    name, category, quantity, price,
  } = req.body;

  service.create(name, category, quantity, price);
};

module.exports.removeIngredient = (req, res, next) => {
  const service = new IngredientService(res, next);
  const { ingredientId } = req.params;

  service.remove(ingredientId);
};

module.exports.setIngredientsQuantity = (req, res, next) => {
  const service = new IngredientService(res, next);
  const { ingredientId } = req.params;
  const { quantity } = req.body;

  service.setQuantity(ingredientId, quantity);
};
