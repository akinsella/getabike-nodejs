// Generated by CoffeeScript 1.6.3
var ECT, MongoStore, allowCrossDomain, app, auth, bike, client, config, device, ectRenderer, express, fs, login, mongo, news, notification, oauth2, passport, path, requestLogger, routes, security, site, user, util, utils,
  _this = this;

fs = require('fs');

path = require('path');

util = require('util');

express = require('express');

MongoStore = require('connect-mongo')(express);

mongo = require('./lib/mongo');

passport = require('passport');

login = require('connect-ensure-login');

requestLogger = require('./lib/requestLogger');

allowCrossDomain = require('./lib/allowCrossDomain');

utils = require('./lib/utils');

security = require('./lib/security');

config = require('./conf/config');

routes = require('./route/index');

bike = require('./route/bike');

auth = require('./route/auth');

news = require('./route/news');

device = require('./route/device');

notification = require('./route/notification');

client = require('./route/client');

user = require('./route/user');

site = require('./route/site');

oauth2 = require('./oauth2');

ECT = require('ect');

ectRenderer = ECT({
  cache: true,
  watch: true,
  root: "views"
});

console.log("Application Name: " + config.cf.app.name);

console.log("Env: " + (JSON.stringify(config.cf)));

require('./auth');

app = express();

app.configure(function() {
  console.log("Environment: " + (app.get('env')));
  app.set('port', config.cf.port || process.env.PORT || 9000);
  app.set('views', "" + __dirname + "/views");
  app.set('view engine', 'ect');
  app.engine('.ect', ectRenderer.render);
  app.use('/images', express["static"]("" + __dirname + "/public/images"));
  app.use('/scripts', express["static"]("" + __dirname + "/public/scripts"));
  app.use('/styles', express["static"]("" + __dirname + "/public/styles"));
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.cf.app.instance_id,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore({
      db: config.mongoConfig.credentials.name,
      host: config.mongoConfig.credentials.host,
      port: config.mongoConfig.credentials.port,
      username: config.mongoConfig.credentials.username,
      password: config.mongoConfig.credentials.password,
      collection: "sessions",
      auto_reconnect: true
    })
  }));
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(allowCrossDomain());
  app.set('running in cloud', config.cf.cloud);
  app.use(requestLogger());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(function(err, req, res, next) {
    console.error("Error: " + err + ", Stacktrace: " + err.stack);
    return res.send(500, "Something broke! Error: " + err + ", Stacktrace: " + err.stack);
  });
});

app.configure('development', function() {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/api/city', bike.cities);

app.get('/api/station/:contract', bike.stations);

app["delete"]('/api/news/:id', news.removeById);

app.post('/api/news', news.create);

app.get('/api/news', news.list);

app.get('/api/news/:id', news.findById);

app["delete"]('/api/device/:id', device.removeById);

app.post('/api/device', device.create);

app.get('/api/device', device.list);

app.get('/api/device/:id', device.findById);

app["delete"]('/api/client/:id', client.removeById);

app.post('/api/client', client.create);

app.get('/api/client', client.list);

app.get('/api/client/:id', client.findById);

app["delete"]('/api/user/:id', user.removeById);

app.post('/api/user', user.create);

app.get('/api/user', user.list);

app.get('/api/user/:id', user.findById);

app["delete"]('/api/notification', notification.removeById);

app.post('/api/notification', notification.create);

app.get('/api/notification', notification.list);

app.get('/api/notification/:id', notification.findById);

app.get('api/notification/push', notification.push);

app.get('/api/user/me', passport.authenticate("bearer", {
  session: false
}), user.me);

app.get('/', site.index);

app.get('/login', site.loginForm);

app.post('/login', site.login);

app.get('/logout', site.logout);

app.get('/account', login.ensureLoggedIn(), site.account);

app.get('/dialog/authorize', oauth2.authorization);

app.post('/dialog/authorize/decision', oauth2.decision);

app.post('/oauth/token', oauth2.token);

app.get('/api/user/me', user.me);

app.get('/auth/account', security.ensureAuthenticated, auth.account);

app.get('/auth/login', auth.login);

app.get('/auth/google', passport.authenticate('google', {
  failureRedirect: '/login'
}), auth.authGoogle);

app.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), auth.authGoogleCallback);

app.get('/auth/logout', auth.logout);

process.on('SIGTERM', function() {
  console.log('Got SIGTERM exiting...');
  return process.exit(0);
});

process.on('uncaughtException', function(err) {
  console.error("An uncaughtException was found, the program will end. " + err + ", stacktrace: " + err.stack);
  return process.exit(1);
});

console.log("Express listening on port: " + (app.get('port')));

app.listen(app.get('port'));

console.log('Initializing xebia-mobile-backend application');