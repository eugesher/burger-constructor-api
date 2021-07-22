const router = require('express').Router();

const { headersValidation } = require('../middlewares/validations');
const { getOrders, makeOrder } = require('../controllers/orders');

router.get('/', headersValidation, getOrders);
router.post('/', makeOrder);

module.exports = router;
