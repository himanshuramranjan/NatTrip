const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);

// Protects all the following routes from un-authenticated req
router.use(authController.protectRoute);

// User accessible routes
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe, userController.updateUser);
router.delete('/deleteMe', userController.deleteMe);
router.patch('/updatePassword', authController.updatePassword);
router.post('/logout', authController.logout);


router.route('/').get(userController.getAllUsers);
router.route('/:id').get(authController.protectRoute, authController.restrictRoute('user'), userController.getUser);


module.exports = router;