const Card = require('../models/card');

const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');

/* возвращает все карточки */
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

/* создает карточку */
module.exports.createCard = (req, res, next) => {
  // console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(`Данные некорректны ${err.message}`));
      }
      return next(err);
    })
    .catch(next);
};

/* удаляет карточку по идентификатору */
module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');
        /* return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }); */
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}`));
        return;
      }
      next(err);

    /* .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Некорректные данные. Проверьте id карточки'
        });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }); */
    });
};

/* поставить лайк карточке */
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');
        /* return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }); */
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}`));
        return;
      }
      next(err);

    /* .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Некорректные данные. Проверьте id карточки'
        });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }); */
    });
};

/* убрать лайк с карточки */
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFound('Запрашиваемая карточка не найдена');

        /* return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }); */
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`Данные некорректны ${err.message}`));
        return;
      }
      next(err);

    /* .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({
          message: 'Некорректные данные. Проверьте id карточки'
        });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }); */
    });
};