const express = require('express');

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

const realEstate_router = require('./routes/realEstate_router');

app.use('/api/v1/real-estates', realEstate_router);

module.exports = app;
