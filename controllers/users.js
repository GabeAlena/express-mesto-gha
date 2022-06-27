const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const Unauthorized = require('../errors/Unauthorized');

/* создание пользователя */
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  /*
  if (!password || !email) {
    return res.status(400).send({ message: 'Email или пароль не могут быть пустыми' });
  }
  */

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Такой пользователь уже зарегистрирован');
      }
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(`Данные некорректны ${err.message}`));
        /*
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
        */
      }
      return next(err);
    })
    .catch(next);
};

/* контроллер, который получает из запроса почту и пароль и проверяет их */
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }).send({ token });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new Unauthorized('Неверные почта или пароль'));
      }
      next(err);
    });
};

/* Получение информации о текущем пользователе */
module.exports.returnUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден!');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
  /*
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }));
  */
};

/* возвращение всех пользователей */
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        next(new Unauthorized('Вы не авторизованы!'));
      }
      return res.send({ data: users });
    })
    .catch((err) => next(err));
};

/* возвращение пользователя по _id */
module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
        /*
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}. Проверьте id пользователя`));
        /*
        res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}. Проверьте id` });
        */
        return;
      }
      next(err);
      /*
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
      */
    });
};

/* обновляет профиль */
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
        /*
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}`));
        return;
      }
      next(err);
      /*
      if (err.name === 'CastEror') {
        return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
      }
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
      */
    });
};

/* обновляет аватар */
module.exports.updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFound('Запрашиваемый пользователь не найден');
        /*
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        */
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}`));
        return;
      }
      next(err);
      /*
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: `Данные некорректны ${err.message}` });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
      */
    });
};