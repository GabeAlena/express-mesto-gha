const Card = require('../models/card');

const ERROR_CODE = 400;
const NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

/* возвращает все карточки */
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' }));
};

/* создает карточку */
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner }, { new: true, runValidators: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в метод создания карточки' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* удаляет карточку по идентификатору */
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в метод создания карточки' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* поставить лайк карточке */
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.body._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в метод постановки лайка' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};

/* убрать лайк с карточки */
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.CardId, { $pull: { likes: req.body._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные в метод удаления лайка' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Сервер не может обработать запрос' });
    });
};