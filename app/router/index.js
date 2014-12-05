var logger = require('../logger');

var checkAuthApplicant = function(req, res, next) {
    if(req.session.applicantUserId) {
        next();
    } else {
        var err = new Error("Forbidden");
        err.name = "error";
        err.status = 403;
        next(err);
    }
};

module.exports = function(app) {
    app.use('/register', require('./routes/register'));
    app.use('/login', require('./routes/login'));
    app.use('/logout', require('./routes/logout'));
    app.use('/profile', require('./routes/profile'));
    app.use('/post', require('./routes/post'));
    app.use('/post', require('./routes/review'));
    app.use('/upload', require('./routes/upload'));
    app.use('/resume', require('./routes/resume'));
    app.use('/search', require('./routes/search'));
    app.use('/heartbeat', require('./routes/heartbeat'));
    app.use('/bookmark', require('./routes/bookmark'));
    app.use('/payment', require('./routes/payment'));
    /*
     * Error middleware
     */
    app.use(function(err, req, res, next) {
        if(!err && err.status >= 200 && err.status < 300) {
            next();
        }

        if(!err.status) {
            err.status = 500;
            logger.error(err);
        } else if (!err.name) {
            switch(err.status) {
                case 400:
                    err.name = "BadRequestError";
                    break;
                case 401:
                    err.name = "UnauthorizedError";
                    break;
                case 403:
                    err.name = "ForbiddenError";
                    break;
                case 404:
                    err.name = "NotFoundError";
                    break;
                case 405:
                    err.name = "MethodNotAllowedError";
                    break;
                case 406:
                    err.name = "NotAcceptableError";
                    break;
                case 409:
                    err.name = "ConflictErrpr";
                    break;
            }
        }

        res.status(err.status).json(err);
    });
};
