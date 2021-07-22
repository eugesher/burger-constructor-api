const router = require('express').Router();
const userRouter = require('./users');
const burgerRouter = require('./burgers');
const ingredientsRouter = require('./ingredients');
const ordersRouter = require('./orders');

router.use('/users', userRouter);
router.use('/burgers', burgerRouter);
router.use('/ingredients', ingredientsRouter);
router.use('/orders', ordersRouter);

module.exports = router;
