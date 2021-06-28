const router = require('express').Router();
const userRouter = require('./users');
const burgerRouter = require('./burgers');

router.use('/users', userRouter);
router.use('/burgers', burgerRouter);

module.exports = router;
