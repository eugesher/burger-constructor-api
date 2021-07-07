const router = require('express').Router();

const { getOrders, makeOrder } = require('../controllers/orders');

router.get('/', getOrders);
router.post('/', makeOrder);

module.exports = router;
