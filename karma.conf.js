module.exports = function(config) {
    config.set({
        frameworks: ['mocha'],

        files: [
            'site/build/js/all.js',
            'site/spec/*.js'
        ],

        client: {
            mocha: {
                reporter: 'html',
                ui: 'tdd'
            }
        }, 

        browsers: ['PhantomJS']
    });
};
