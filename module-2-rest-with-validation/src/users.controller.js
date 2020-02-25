const users = require('./users.service');

exports.processIdParam = (req, res, next, id) => {
    req.user = users.find(id);
    if (req.user === undefined || req.user.isDeleted === true) {
        const error = new Error(`User with id ${id} not found`);
        error.statusCode = 404;
        throw error;
    }
    next();
};

exports.findUser = (req, res) => {
    res.status(200).json(req.user);
};

exports.findSuggested = (req, res) => {
    const loginSubstring = req.query.loginSubstring;
    const limit = req.query.limit;
    res.status(200).json(users.findSuggested(loginSubstring, limit));
};

exports.createUser = (req, res) => {
    const addedUser = users.add(req.body);
    res.status(201).send(addedUser);
};

exports.removeUser = (req, res) => {
    users.delete(req.user);
    res.status(200).send();
};

exports.updateUser = (req, res) => {
    users.update(req.user, req.body);
    res.status(200).send();
};

exports.processError = (error, req, res, next) => {
    const { statusCode, message } = error;
    res.status(statusCode).json({ message });
    next(error);
};

exports.validateSchema = (schema)  => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        allowUnknown: false
    });
    if (error) {
        res.status(400).json(errorResponse(error.details));
    } else {
        return next();
    }
};

function errorResponse(schemaErrors) {
    const errors = schemaErrors.map((error) => {
        const { path, message } = error;
        return { path, message };
    });
    return {
        status: 'failed',
        errors
    };
}
