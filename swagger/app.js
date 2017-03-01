'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

var cors = require('cors')
let jwt = require('jsonwebtoken')

module.exports = app; // for testing

var config = {
  appRoot: __dirname, // required config

  swaggerSecurityHandlers: {
    Bearer: function(req, authOrSecDef, scopesOrApiKey, cb) {
// console.log(scopesOrApiKey )
      jwt.verify(scopesOrApiKey, 'secret', function(err, decoded) {
          if (err) return cb(new Error('Access Denied'))
          else {
            req.decoded = decoded
            return cb(null)
          }
      });
      //cb(null)
      // cb(new Error('Access Denied'))
    }
  }
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

app.use(cors());

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
