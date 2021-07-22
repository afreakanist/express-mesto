const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const { createUser, login } = require('./controllers/user');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

// app.use(auth);
app.use('/users', auth, require('./routes/user'));
app.use('/cards', auth, require('./routes/card'));

app.all('*', (req, res, next) => next(new NotFoundError('Запрашиваемый ресурс не найден')));

app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
