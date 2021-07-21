const router = require('express').Router();

const { headersValidation } = require('../middlewares/validations');
const { getCurrentUser } = require('../controllers/users');

router.get('/me', headersValidation, getCurrentUser);

module.exports = router;
