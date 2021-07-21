const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { createUser, login } = require('./controllers/user');

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

// app.all('/*', (req, res) => res.status(404).send({ message: 'Ресурс не найден' }));

app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
