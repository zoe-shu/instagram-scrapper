const env = require('dotenv').load(),
config = require( __dirname + '/config.json' )[process.env.NODE_ENV],
config_web = config.web,
_WEB_PORT = config_web.port,
_WEB_HOST = config_web.host;

const express = require('express'),
app = express(),
router = express.Router(),
compression = require('compression'),
ejs = require('ejs'),
cookieParser = require('cookie-parser'),
fs = require('fs'),
bodyParser = require('body-parser'),
csrf = require('csurf'),
csrfProtection = csrf({ cookie: true }),
parseForm = bodyParser.urlencoded({ extended: false }),
methodOverride = require('method-override'),
request = require('request'),
server = require('http').createServer(app),
moment = require('moment');

app.use(compression());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(express.static(__dirname + '/public')); //, { maxAge: oneDay }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

// app.get('/', function(req, res) {
//   res.render('index',{});
// });

app.get('/ig_id=:ig_id', function(req, res) {
    var username = req.params.ig_id;
    var r = new RegExp('<script type="text\/javascript">' +
                     '([^{]+?({.*profile_pic_url.*})[^}]+?)' +
                     '<\/script>');
    var url = "https://www.instagram.com/" + username, totalComments = 0, totalLikes = 0;

    request({ url: url, json: true}, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        res.send(error || {status: "user_not_exist", statusCode: response.statusCode});
      }else{
        var jsonStr = body.match(r)[2];
        var data = JSON.parse(jsonStr);
        var oldVariantOfData = data['entry_data']['ProfilePage'][0];

        res.send(oldVariantOfData.graphql.user);
      }
    });
});

app.get('*', function(req, res) {
  res.status(404);
  res.send('404');
});

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
  // handle CSRF token errors here
  res.status(403)
  res.send('Error.')
});
server.listen(_WEB_PORT, function(){
    console.log(`Listening on port http://${_WEB_HOST}:${_WEB_PORT}/`);
});
