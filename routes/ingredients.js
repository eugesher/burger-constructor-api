const router = require('express').Router();

const {
  getIngredients, addNewIngredient, setIngredientsQuantity, removeIngredient,
} = require('../controllers/ingredients');
const { ingredientCategories } = require('../utils');

// noinspection JSCheckFunctionSignatures
router.get('/', getIngredients);
router.post('/', addNewIngredient);
router.patch('/:ingredientId', setIngredientsQuantity);
router.delete('/:ingredientId', removeIngredient);

ingredientCategories.forEach((category) => {
  router.get(`/${category}`, (req, res) => getIngredients(req, res, { category }));
});

module.exports = router;
