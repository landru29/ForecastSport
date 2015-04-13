/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function (grunt) {
    "use strict";

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configure Grunt
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        project: {
            app: '.',
            test: './test'
        },


        jshint: {
            dev: [
                '<%= project.app%>/middlewares/**/*.js',
                '<%= project.app%>/services/**/*.js',
                '<%= project.app%>/app.js',
                '<%= project.test%>/**/*.js',
                'Gruntfile.js'
            ]
        },

        /*************************************************/
        /** TEST                                        **/
        /*************************************************/

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },




    });

    grunt.registerTask('check', [
        'jshint:dev'/*,
        'karma:unit'*/
    ]);


    grunt.registerTask('default', ['check']);
};