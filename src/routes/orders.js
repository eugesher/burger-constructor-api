const router = require('express').Router();

const { headersValidation, makeOrderValidation } = require('../middlewares/validations');
const { getOrders, makeOrder } = require('../controllers/orders');

router.get('/', headersValidation, getOrders);
router.post('/', makeOrderValidation, makeOrder);

module.exports = router;
