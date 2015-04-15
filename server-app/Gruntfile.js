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
            app: './app',
            test: './test',
            restClient: './rest-client'
        },
        
        /*************************************************/
        /** REST CLIENT                                 **/
        /*************************************************/
        
        express: { // create a server to localhost
            rest: {
                options: {
                    bases: ['<%= project.restClient%>', './node_modules/angular-webstorage/dist'],
                    port: 9000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        open: { // open application in Chrome
            rest: {
                path: 'http://localhost:<%= express.rest.options.port%>',
                app: 'google-chrome'
            }
        },

        watch: { // watch files, trigger actions and perform livereload
            rest: {
                files: ['<%= project.restClient%>/index.html', '<%= project.restClient%>/scripts/**/*.js'],
                tasks: [
                ],
                options: {
                    livereload: true
                }
            }
        },

        
        /*************************************************/
        /** QUALITY OF CODE                             **/
        /*************************************************/


        jshint: {
            dev: [
                '<%= project.app%>/**/*.js',
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
    
    grunt.registerTask('rest', [
        'express:rest',
        'open:rest',
        'watch:rest'
    ]);


    grunt.registerTask('default', ['check']);
};
