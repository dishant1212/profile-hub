const express = require('express');
const {
  handleUserSignup,
  handleUserSignin,
  getUserProfile,
  updateUserProfile,
} = require('../controller/users');
const imageUpload = require('../utils/imageUpload');
const restrictToLoggedinUserOnly = require('../moddlewares/auth');

const userRouter = express.Router();

userRouter.post('/user/signup', handleUserSignup);
userRouter.post('/user/signin', handleUserSignin);

userRouter.get('/user/profle/:id', restrictToLoggedinUserOnly, getUserProfile);
userRouter.put(
  '/user/profle/:id',
  restrictToLoggedinUserOnly,
  imageUpload.single('profileImg'),
  updateUserProfile
);

module.exports = userRouter;
