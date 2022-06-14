const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatarUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatarUser);

module.exports = userRouter;