const router = require('express').Router();
const userRouter = require('./users');
const burgerRouter = require('./burgers');
const bunsRouter = require('./buns');

router.use('/users', userRouter);
router.use('/burgers', burgerRouter);
router.use('/buns', bunsRouter);

module.exports = router;
