const {
  PORT,
  SECRET
} = require('./config');

const express = require('express');

const app = express();

app.use(express.json());
app.use(require('cors')());

app.set('SECRET', SECRET);

app.use('/uploads', express.static(__dirname + '/uploads'))

require('./db')(app);
require('./routes')(app);

app.listen(PORT, () => {
  console.log(`App is listenning on port ${PORT}`)
})