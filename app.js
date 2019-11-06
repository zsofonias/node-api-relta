const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/AppError');
const ErrorsController = require('./controllers/ErrorsController');

const app = express();

app.use(morgan('dev'));

app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

const realEstates_router = require('./routes/realEstates_router');
const users_router = require('./routes/users_router');

app.use('/api/v1/real-estates', realEstates_router);
app.use('/api/v1/users', users_router);

app.all('*', (req, res, next) => {
  next(new AppError(`Resource Not Found on ${req.url}`, 404));
});

app.use(ErrorsController.errorDispatcher);

module.exports = app;
