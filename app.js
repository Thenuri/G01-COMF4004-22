var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// router imports
const ManageBusRouter = require('./routes/manageBus');
const authRouter = require('./routes/auth');
const accountRouter = require('./routes/accountRouter');
const bookingRouter = require('./routes/booking');
const vehicleRouter = require('./routes/vehicle');
const dashboardRouter = require('./routes/dashboard');



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
app.use(bodyParser.json({limit: '100mb'})) // to parse json to req.body
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.text({ limit: '200mb' }));


// to parse cookies
app.use(cookieParser())

// authenticate
// if auth success will add email, and account id to req.body.Email, req.body.Account_ID 
const authenticateJWT = require('./middleware/authMiddleware');

const getProfileDetailsIfLoggedIn = require('./middleware/getProfileDetailsIfLoggedIn')

app.use(cors())

// Use routers
app.use(express.static('routes'));
app.use('/auth', authRouter);  // only the posts are in this
app.use('/booking', bookingRouter);
app.use('/vehicle', vehicleRouter);
app.use('/managebus', ManageBusRouter);
app.use('/accounts', accountRouter);
app.use('/dashboard',dashboardRouter);


app.get('/', getProfileDetailsIfLoggedIn, (req, res) => {
  console.log('inthe /',res.locals.name)
  res.render('index')
})

app.get('/protected', getProfileDetailsIfLoggedIn ,authenticateJWT, (req, res) => {
  res.send("Protected route")
})

app.post('/test', (req, res) => {
  console.log(res)
  res.send("HI")
})

// Display the auth webpages
app.get('/signin', (req, res) => {
  res.render("login")
})

app.get('/signup', (req, res) => {
  res.render("signup")
})

app.get('/signout', (req, res) => {
  res.clearCookie("token");
  res.redirect("/")
})

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