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
            build: './build',
            dist: './dist',
            app: './app',
            bower: './bower_components'
        },

        /*************************************************/
        /** TASK USED IN GRUNT SERVE                    **/
        /*************************************************/
        express: { // create a server to localhost
            dev: {
                options: {
                    bases: ['<%= project.build%>', '<%= project.app%>', __dirname],
                    port: 9000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            },
            prod_check: {
                options: {
                    bases: [__dirname + '/<%= project.dist%>'],
                    port: 3000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        open: { // open application in Chrome
            dev: {
                path: 'http://localhost:<%= express.dev.options.port%>',
                app: 'google-chrome'
            },
            prod_check: {
                path: 'http://localhost:<%= express.prod_check.options.port%>',
                app: 'google-chrome'
            }
        },

        watch: { // watch files, trigger actions and perform livereload
            dev: {
                files: ['<%= project.app%>/index.html', '<%= project.app%>/scripts/**/*.js', '<%= project.app%>/styles/**/*', '<%= project.app%>/views/**'],
                tasks: [
                    'sass:dist',
                    'copy:dev',
                    'jshint'
                ],
                options: {
                    livereload: true
                }
            },
            prod_check: {
                files: ['<%= project.dist%>/**'],
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
                '<%= project.app%>/scripts/**/*.js',
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

        /*************************************************/
        /** TASK USED BUILDING                          **/
        /*************************************************/

        useminPrepare: {
            html: {
                src: ['<%= project.app%>/index.html']
            },
            options: {
                dest: '<%= project.dist%>',
                staging: '<%= project.build%>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        usemin: {
            html: [
                '<%= project.dist%>/index.html'
            ],
            options: {
                assetsDirs: ['<%= project.dist%>']
            }
        },

        concat: { // concatenate JS files in one
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    '<%= project.app%>/scripts/*.js',
                    '<%= project.app%>/scripts/controllers/*.js',
                    '<%= project.app%>/scripts/directives/*.js',
                    '<%= project.app%>/scripts/services/*.js'
                ],
                // the location of the resulting JS file
                dest: '<%= project.build%>/<%= pkg.name %>.js'
            }
        },

        wiredep: { // Inject bower components in index.html
            app: {
                src: ['<%= project.app%>/index.html'],
                ignorePath: /\.\.\//
            }
        },

        cssmin: {
            dist: {
                files: [
                    {
                        dest: '<%= project.dist%>/styles/styles.min.css',
                        src: ['<%= project.app%>/styles/*.css', '<%= project.build%>/styles/*.css']
                    }
                ]
            }
        },

        uglify: { // uglify the concatenated JS file
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/scripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        clean: { // erase all files in dist and build folder
            dist: ['<%= project.dist%>', '<%= project.build%>'],
            dev: ['<%= project.build%>']
        },

        sass: { // compile SCSS files into css files
            options: {
                compass: true
            },
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%= project.app%>/styles/',
                    src: ['*.scss'],
                    dest: '<%= project.build%>/styles',
                    ext: '.css'
                }]
            }
        },

        filerev: { // change the name of files to avoid browser cache issue
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= project.dist%>/styles/*.css'
            },
            js: {
                src: '<%= project.dist%>/scripts/*.js'
            }
        },

        copy: { // Copy files (images, ...)
            dist: {
                files: [
                    { // Images for the styles
                        expand: true,
                        flatten: true,
                        src: ['<%= project.app%>/styles/img/**'],
                        dest: '<%= project.dist%>/styles/img'
                    },
                    { // html files in views foldder
                        expand: true,
                        flatten: false,
                        cwd: '<%= project.app%>/views/',
                        src: ['**'],
                        //filter: 'isFile',
                        dest: '<%= project.dist%>/views/'
                    },
                    { // glyphicon from bootstrap
                        expand: true,
                        flatten: true,
                        src: ['bower_components/bootstrap/fonts/*'],
                        filter: 'isFile',
                        dest: '<%= project.dist%>/fonts'
                    },
                    { // JSON fils in data folder
                        expand: true,
                        flatten: true,
                        src: ['<%= project.app%>/data/*.json'],
                        dest: '<%= project.dist%>/data',
                        filter: 'isFile'
                    },
                    { // favico
                        expand: true,
                        flatten: true,
                        src: ['<%= project.app%>/favicon.ico'],
                        dest: '<%= project.dist%>/',
                        filter: 'isFile'
                    },
                    { // track in wordpress plugin
                        expand: true,
                        flatten: true,
                        src: ['<%= project.bower%>/roller-derby-model/roller-derby-model.min.js'],
                        dest: '<%= project.wordpress%>/track-simulator/js',
                        filter: 'isFile'
                    },
                    { // track in wordpress plugin
                        expand: true,
                        flatten: true,
                        src: ['<%= project.bower%>/roller-derby-model/roller-derby-model.min.css'],
                        dest: '<%= project.wordpress%>/track-simulator/css',
                        filter: 'isFile'
                    }
                ],
            },
            html: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= project.app%>/index.html'],
                        dest: '<%= project.dist%>/',
                        filter: 'isFile'
                    }
                ]
            },
            dev: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['<%= project.app%>/styles/img/**'],
                        dest: '<%= project.build%>/styles/img'
                    },
                ]
            }
        },

        'json-minify': {
            build: {
                files: '<%= project.dist%>/data/**/*.json'
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'dist.tgz'
                },
                files: [
                    {
                        src: ['<%= project.dist%>/**'],
                        expand: true,
                        dest: '.'
                    }
                ]
            }
        },

        ngconstant: {
            options: {
                name: 'ClientGruntConfiguration',
                dest: '<%= project.app%>/build/config.js',

            },
            dist: {

                constants: {
                    apiUrl: false
                }
            },
            dev: {

                constants: {
                    apiUrl: 'http://localhost:3000'
                }
            }
        }
    });

    grunt.registerTask('serve', [
        'clean:dev',
        'ngconstant:dev',
        'wiredep',
        'sass:dist',
        'copy:dev',
        'express:dev',
        'open:dev',
        'watch:dev'
    ]);

    grunt.registerTask('prod_check', [
        'express:prod_check',
        'open:prod_check',
        'watch:prod_check'
    ]);

    grunt.registerTask('check', [
        'wiredep',
        'jshint:dev',
        'karma:unit'
    ]);

    grunt.registerTask('prod', [
        'karma:unit',
        'clean:dist',
        'ngconstant:dist',
        'wiredep',
        'copy:html',
        'useminPrepare',
        'concat:dist',
        'concat:generated', // this task is generated by useminPrepare
        'sass:dist',
        'cssmin:dist',
        'cssmin:generated', // this task is generated by useminPrepare
        'uglify:dist',
        'uglify:generated', // this task is generated by useminPrepare
        'copy:dist',
        'json-minify',
        'filerev:js',
        'filerev:css',
        'usemin',
        'compress'
    ]);

    grunt.registerTask('default', ['prod']);
};