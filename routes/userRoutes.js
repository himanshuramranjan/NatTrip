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

// Protects all the below routes from un-authorized req
router.use(authController.restrictRoute('admin'));

// Admin accessible routes
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;