const router = require('express').Router();

const {
  getIngredients, addNewIngredient, setIngredientsQuantity, removeIngredient,
} = require('../controllers/ingredients');

router.get('/', getIngredients);
router.post('/', addNewIngredient);
router.patch('/:ingredientId', setIngredientsQuantity);
router.delete('/:ingredientId', removeIngredient);
router.get('/:category', getIngredients);

module.exports = router;
