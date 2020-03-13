const Joi = require('joi');

module.exports = Joi.object().keys({
    login: Joi.string().required(),
    password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{4,}$/).required(),
    age: Joi.number().min(4).max(130).required()
});
