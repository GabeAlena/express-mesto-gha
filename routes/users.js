const userRouter = require('express').Router();
const {
  login,
  returnUser,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatarUser,
} = require('../controllers/users');

userRouter.post('/signup', createUser);
userRouter.post('/signin', login);

userRouter.get('/users', getUsers);
userRouter.get('/users/me', returnUser);
userRouter.get('/users/:userId', getUser);
userRouter.patch('users/me', updateUser);
userRouter.patch('users/me/avatar', updateAvatarUser);

module.exports = userRouter;