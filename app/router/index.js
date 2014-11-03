module.exports = function(app, db) {
    app.use('/api/v1/register', require('./routes/register')(db));
};
