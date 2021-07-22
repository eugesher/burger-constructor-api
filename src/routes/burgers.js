const router = require('express').Router();

const { headersValidation, saveBurgerValidation, deleteBurgerValidation } = require('../middlewares/validations');
const { getBurgers, saveBurger, deleteBurger } = require('../controllers/burgers');

router.get('/', headersValidation, getBurgers);
router.post('/', saveBurgerValidation, saveBurger);
router.delete('/:burgerId', deleteBurgerValidation, deleteBurger);

module.exports = router;
