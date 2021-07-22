const router = require('express').Router();

const {
  headersValidation,
  newIngredientValidation,
  setIngredientsQuantityValidation,
  removeIngredientValidation,
  getIngredientsByCategoryValidation,
} = require('../middlewares/validations');

const {
  getIngredients,
  addNewIngredient,
  setIngredientsQuantity,
  removeIngredient,
} = require('../controllers/ingredients');

router.get('/', headersValidation, getIngredients);
router.get('/:category', getIngredientsByCategoryValidation, getIngredients);
router.post('/', newIngredientValidation, addNewIngredient);
router.patch('/:ingredientId', setIngredientsQuantityValidation, setIngredientsQuantity);
router.delete('/:ingredientId', removeIngredientValidation, removeIngredient);

module.exports = router;
