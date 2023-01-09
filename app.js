var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// router imports
var ManageBusRouter = require('./routes/ManageBus');
const authRouter = require('./routes/auth')
const accountRouter = require('./routes/accountRouter')
const bookingRouter = require('./routes/booking')
const vehicleRouter = require('./routes/vehicle')



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middleware 
// to parse json in body
const bodyParser = require('body-parser') 
app.use(bodyParser.json()) // to parse json to req.body


// to parse cookies
app.use(cookieParser())

// authenticate
// if auth success will add email, and account id to req.body.Email, req.body.Account_ID
const AuthenicateWithJWT = require('./middleware/authMiddleware') 



// Use routers
app.use('/api/auth', authRouter)
app.use(cors())
app.use('/booking', bookingRouter)
app.use('/vehicle', vehicleRouter)

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/ManageBus', ManageBusRouter);
app.use(express.static('routes'));
app.use('/api/auth', authRouter);
app.use('/accounts', accountRouter);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });


// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;