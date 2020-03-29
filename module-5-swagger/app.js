var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

var mongoose = require('mongoose');

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);
});
