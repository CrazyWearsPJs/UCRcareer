module.exports = function(app, db) {
    app.use('/register', require('./routes/register')(db));
};
