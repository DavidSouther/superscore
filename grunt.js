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
				src: ['src/*.js'],
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
			lib: {
				files: {
					'build/*.js': 'src/**/*.ls',
					'build/<%= pkg.name %>.full.js': 'build/<%= pkg.name %>.full.ls'
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
			}
		},
		test: {
			files: ['test/nunit/**/*.js']
		},
		qunit: {
			files: ['test/qunit/**/*.html']
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-livescript');

	grunt.registerTask('build', 'concat:lib');
	grunt.registerTask('package', 'concat:node concat:amd concat:min copy:qunit copy:qunitAmdUnderscore');
	grunt.registerTask('nunit', 'test');
	grunt.registerTask('tests', 'livescript:nunit livescript:qunit nunit qunit');
	grunt.registerTask('default', 'clean build package tests');
};
