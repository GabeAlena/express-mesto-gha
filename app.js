const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, _res, next) => {
  req.user = {
    _id: '62a766fdc4a74e048b6f8233',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.listen(PORT);