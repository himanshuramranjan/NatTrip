const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);


router.route('/logout').post(authController.logout);

router.route('/').get(userController.getAllUsers);
router.route('/:id').get(authController.protectRoute, userController.getUser);
module.exports = router;