require('dotenv').config();

const mongoose = require('mongoose');

const app = require('./app');

PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('DB Connection is ON');
  });

const server = app.listen(PORT, () => {
  console.log('Server running on ', PORT);
});
