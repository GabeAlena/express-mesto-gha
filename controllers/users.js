const User = require('../models/user');
const { ERROR_CODE, NOT_FOUND, ERROR_DEFAULT } = require('../utils/utils');

/* возвращение всех пользователей */
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }));
};

/* возвращение пользователя по _id */
module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}. Проверьте id пользователя` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* создание пользователя */
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* обновляет профиль */
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastEror') {
        return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* обновляет аватар */
module.exports.updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};