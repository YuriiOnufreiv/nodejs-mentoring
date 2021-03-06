var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var securityHelper = require('./api/helpers/security');
var errorsHandler = require('./api/helpers/errors.handler');

var config = {
    appRoot: __dirname,
    swaggerSecurityHandlers: {
        api_key: (req, securityDefinition, apiKey, next) => {
            securityHelper.validateApiKey(apiKey, next);
        }
    }
}

var mongoose = require('mongoose');

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.use(errorsHandler.handle);

  app.listen(port);
});
