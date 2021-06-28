const router = require('express').Router();

const { getBurgers, saveBurger, deleteBurger } = require('../controllers/burgers');

router.get('/', getBurgers);
router.post('/', saveBurger);
router.delete('/:burgerId', deleteBurger);

module.exports = router;
