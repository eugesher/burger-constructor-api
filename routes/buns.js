const router = require('express').Router();

const {
  getBuns, addNewBun, setBunsQuantity, removeBun,
} = require('../controllers/buns');

router.get('/', getBuns);
router.post('/', addNewBun);
router.patch('/:bunId', setBunsQuantity);
router.delete('/:bunId', removeBun);

module.exports = router;
