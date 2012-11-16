module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
				'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
		},
		clean: {
			all: ['build/', 'lib/', 'dist/']
		},
		concat: {
			lib: {
				src: ['build/*.js'],
				dest: 'build/<%= pkg.name %>.full.js'
			},
			node: {
				src: ['src/node/pre.js', 'build/<%= pkg.name %>.full.js', 'src/node/post.js'],
				dest: 'lib/<%= pkg.name %>.js'
			},
			amd: {
				src: ['src/amd/pre.js', 'build/<%= pkg.name %>.full.js', 'src/amd/post.js'],
				dest: 'lib/<%= pkg.name %>.amd.js'
			},
			min: {
				src: ['src/min/pre.js', 'build/<%= pkg.name %>.full.js', 'src/min/post.js'],
				dest: 'lib/<%= pkg.name %>.min.js'
			}
		},
		copy: {
			src: {
				files: {
					'build/': "src/*.js"
				}
			},
			qunit: {
				src: ['lib/*'], 
				dest: 'test/qunit/assets/'
			},
			qunitAmdUnderscore: {
				src: ['node_modules/underscore/underscore.js'],
				dest: 'test/qunit/require/'
			}
		},
		livescript: {
			src: {
				files: {
					'build/*.js': 'src/*.ls'
				},
				options: {
					bare: true
				}
			},
			qunit: {
				files: {
					'test/qunit/min/tests.js': 'test/qunit/min/**/*.ls',
					'test/qunit/require/tests.js': 'test/qunit/require/**/*.ls'
				}
			},
			nunit: {
				files: {
					'test/nunit/tests.js': 'test/nunit/**/*.ls'
				},
				options: {
					bare: true
				}
			},
			jasmine: {
				files: {
					'test/jasmine/node/spec/tests.js': 'test/jasmine/node/**/*.ls'
				}
			}
		},
		server: {
			port: 8000,
			base: "."
		},
		test: {
			files: ['test/nunit/**/*.js']
		},
		qunit: {
			min: {
				src: [ 'http://localhost:8000/test/qunit/min/superscore.html' ]
			},
			amd: {
				src: [ 'http://localhost:8000/test/qunit/require/superscore.html' ]
			}
		},
		jasmine_node: {
			projectRoot: 'test/jasmine/node',
			specFolderName: 'spec'
		},
		docco: {
			app: {
				src: ['src/*s']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-livescript');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-docco');

	grunt.registerTask('build', 'copy:src livescript:src concat:lib');
	grunt.registerTask('package', 'concat:node concat:amd concat:min copy:qunit copy:qunitAmdUnderscore');
	grunt.registerTask('nunit', 'livescript:nunit test');
	grunt.registerTask('Qunit', 'livescript:qunit qunit:min qunit:amd');
	grunt.registerTask('jasmine', 'livescript:jasmine jasmine_node');
	grunt.registerTask('testServer', 'server');
	grunt.registerTask('tests', 'testServer jasmine nunit Qunit');
	grunt.registerTask('default', 'clean build package tests docco');
};
