/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function (grunt) {
    "use strict";

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.task.registerMultiTask('serverData', 'Build the list of available resources.', function () {
        var options = this.options({
            dest:null
        });
        var allResources = [];
        var methods = {};
        this.files.forEach(function (f) {
            var resources = grunt.file.readJSON(f.src);
            for (var key in resources) {
                allResources.push(key);
                methods[key] = Object.keys(resources[key].acl);
            }
            grunt.log.writeln('  * ' + f.src);
        });
        
        var content = 'var serverData = {';
        content += 'resources:' + JSON.stringify(allResources) + ',';
        content += 'methods:' + JSON.stringify(methods);
        
        grunt.file.write(options.dest, content + '};');

        //grunt.log.writeln(this.target + ': ' + this.data);
    });


    // Configure Grunt
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        project: {
            app: './app',
            test: './test',
            restClient: './rest-client',
            seeds: './seeds'
        },

        /*************************************************/
        /** REST CLIENT                                 **/
        /*************************************************/

        express: { // create a server to localhost
            rest: {
                options: {
                    bases: ['<%= project.restClient%>', './node_modules'],
                    port: 8000,
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
                files: [
                    '<%= project.restClient%>/index.html', 
                    '<%= project.restClient%>/scripts/**/*.js',
                    '<%= project.app%>/resources.json'
                ],
                tasks: [
                    'serverData:rest',
                    'jshint:rest'
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
                '<%= project.seeds%>/**/*.js',
                '<%= project.restClient%>/**/*.js',
                'Gruntfile.js'
            ],
            rest: [
                '<%= project.restClient%>/**/*.js',
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
        },

        /*****************************************************/
        /** BUILD THE LIST OF RESOURCES FOR THE REST CLIENT **/
        /*****************************************************/

        serverData: {
            rest: {
                files: {
                    src: ['<%= project.app%>/resources.json']

                },
                options: {
                    dest: '<%= project.restClient%>/build/server.js'
                }
            }
        },
        
        /*****************************************************/
        /** BUILD THE SERVER                                **/
        /*****************************************************/
        
        compress: {
            dist: {
                options: {
                    archive: 'dist.tgz'
                },
                files: [
                    {
                        src: ['<%= project.app%>/**', '<%= project.seeds%>/**', 'package.json', './bin/**'],
                        expand: true,
                        dest: '.'
                    }
                ]
            }
        },


    });

    grunt.registerTask('dist', [
        'jshint:dev',
        'mochaTest',
        'compress:dist'
    ]);

    grunt.registerTask('rest', [
        'serverData:rest',
        'jshint:rest',
        'express:rest',
        'open:rest',
        'watch:rest'
    ]);


    grunt.registerTask('default', ['dist']);
};