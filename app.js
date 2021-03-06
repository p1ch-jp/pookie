var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var conf = require('./config.json');

var options = {
  host: conf.db.host,
  port: conf.db.port,
  user: conf.db.user,
  password: conf.db.password,
  database: conf.db.database
}

var sessionStore = new SessionStore(options)

var routes = {
  index: require('./routes/index'),
  register: require('./routes/register'),
  login: require('./routes/login'),
  logout: require('./routes/logout'),
  create: require('./routes/create'),
  callback: require('./routes/callback'),
  users: require('./routes/users')
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'sid',
  key: 'sid',
  secret: 'hoge',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
}));

app.get('/', routes.index);
app.get('/register', routes.register);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/create', routes.create);
app.get('/callback', routes.callback);
app.get('/:users', routes.users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
