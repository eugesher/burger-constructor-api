const router = require('express').Router();
const userRouter = require('./users');
const burgerRouter = require('./burgers');
const ingredientsRouter = require('./ingredients');

router.use('/users', userRouter);
router.use('/burgers', burgerRouter);
router.use('/ingredients', ingredientsRouter);

module.exports = router;
