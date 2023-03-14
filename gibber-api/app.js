const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const socket = require('./config/socket');

const app = express();

require('dotenv').config();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('./models/User');
require("./config/passport");

app.get('/', (req, res, next) => res.status(200).json({hello: 'world'}));

app.use(require("./routes"));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


const port = process.env.PORT || 8000;
const server = app.listen(port, () => {console.log(`listening on *:${port}`);});
socket(server);

module.exports = app;
