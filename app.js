const express = require('express');

const AppError = require('./utils/AppError');
const ErrorsController = require('./controllers/ErrorsController');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

const realEstate_router = require('./routes/realEstate_router');

app.use('/api/v1/real-estates', realEstate_router);

app.all('*', (req, res, next) => {
  next(new AppError(`Resource Not Found on ${req.url}`, 404));
});

app.use(ErrorsController.errorDispatcher);

module.exports = app;
