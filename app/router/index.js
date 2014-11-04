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

module.exports = function(app, db) {
    app.use('/api/v1/register', require('./routes/register')(db));
    app.use('/api/v1/login', require('./routes/login')(db));

    /*
     * Error middleware
     */
    app.use(function(err, req, res, next) {
        if(err.status >= 200 && err.status < 300) {
            next();
        }
        var errorObj = {};
        errorObj[err.name] = err.message;
        res.status(err.status || 500).json(errorObj);
    });
};
