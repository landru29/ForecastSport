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

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    captureFile: 'results.txt', // Optionally capture the reporter output to a file
                    quiet: false, // Optionally suppress output to standard out (defaults to false)
                    clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
                },
                src: ['test/**/*.js']
            }
        }


    });

    grunt.registerTask('check', [
        'jshint:dev',
        'mochaTest'
    ]);


    grunt.registerTask('default', ['check']);
};