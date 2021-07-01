const router = require('express').Router();

const {
  getIngredients, addNewIngredient, setIngredientsQuantity, removeIngredient,
} = require('../controllers/ingredients');
const { ingredientCategories } = require('../utils');

router.get('/', getIngredients);
router.post('/', addNewIngredient);
router.patch('/:ingredientId', setIngredientsQuantity);
router.delete('/:ingredientId', removeIngredient);

ingredientCategories.forEach((ingredient) => {
  router.get(`/${ingredient}`, (req, res) => getIngredients(req, res, ingredient));
});

module.exports = router;
