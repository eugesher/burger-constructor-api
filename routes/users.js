const router = require('express').Router();

const { getCurrentUser, createUser } = require('../controllers/users');

router.get('/me', getCurrentUser);
router.post('/', createUser);

module.exports = router;
