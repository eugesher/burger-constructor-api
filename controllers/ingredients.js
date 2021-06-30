const Ingredient = require('../models/ingredient');

module.exports.getIngredients = (req, res) => {
  Ingredient.find()
    .then((ingredients) => res.send(ingredients));
};

module.exports.addNewIngredient = (req, res) => {
  Ingredient.create({
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
  })
    .then((ingredient) => res.send(ingredient));
};

module.exports.removeIngredient = (req, res) => {
  Ingredient.findByIdAndRemove(req.params.ingredientId)
    .then((removedIngredient) => res.send(removedIngredient));
};

module.exports.setIngredientsQuantity = (req, res) => {
  Ingredient.findByIdAndUpdate(req.ingredient._id, { quantity: req.body.quantity }, { new: true })
    .then((ingredient) => res.send(ingredient));
};
