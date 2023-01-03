var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

// router imports
var ManageBusRouter = require('./routes/ManageBus');
const authRouter = require('./routes/auth')
const accountRouter = require('./routes/accountRouter')



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware 
// to parse json in body
const bodyParser = require('body-parser') 
app.use(bodyParser.json()) // to parse json to req.body


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ManageBus', ManageBusRouter);
app.use(express.static('routes'));
app.use('/api/auth', authRouter);
app.use('/accounts', accountRouter);


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

module.exports = app;
