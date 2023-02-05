module.exports = app => {
  const { Project_Name } = require('../config');

  const mongoose = require('mongoose');

  mongoose.connect(`mongodb://127.0.0.1:27017/${Project_Name}`, {
    useNewUrlParser: true
  })
}