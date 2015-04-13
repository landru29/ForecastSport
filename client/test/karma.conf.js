module.exports = function (config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-translate/angular-translate.min.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'bower_components/angular-translate-loader-url/angular-translate-loader-url.min.js',
            'bower_components/angular-xeditable/dist/js/xeditable.min.js',
            'bower_components/ngstorage/ngStorage.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'app/scripts/app.js', //Force loading this file first to define the module first
            'app/scripts/**/*.js',
            'test/spec/**/*.js',
            'test/fixtures/fixture.js',
            'test/fixtures/*.js',
            
            // fixtures
            /*{
                pattern: 'test/fixtures/*.json', 
                watched: true, 
                served: true, 
                included: false
            }*/
    ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
      'PhantomJS'
    ],

        // Which plugins to enable
        plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
