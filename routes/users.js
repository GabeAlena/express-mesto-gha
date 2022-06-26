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

userRouter.get('/', getUsers);
userRouter.get('/me', returnUser);
userRouter.get('/:userId', getUser);
userRouter.patch('/me', updateUser);
userRouter.patch('/me/avatar', updateAvatarUser);

module.exports = userRouter;