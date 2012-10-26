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
				src: ['src/**/*.ls'],
				dest: 'build/<%= pkg.name %>.full.ls'
			}
		},
		copy: {
			qunit: {
				src: ['lib/*'], 
				dest: 'test/qunit/assets/'
			}
		},
		wrap: {
			node: {
				src: ['build/<%= pkg.name %>.full.js'],
				dest: 'lib/<%= pkg.name %>.js',
				wrapper: ['', '\nmodule.exports = superscore;']
			},
			amd: {
				src: ['build/<%= pkg.name %>.full.js'],
				dest: 'lib/<%= pkg.name %>.amd.js',
				wrapper: [';define([], function(){\n', '\nreturn superscore;\n});']
			},
			min: {
				src: ['build/<%= pkg.name %>.full.js'],
				dest: 'lib/<%= pkg.name %>.min.js',
				wrapper: [';(function(){\n', '\nthis.superscore = superscore}).call(this);']
			},
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
	grunt.loadNpmTasks('grunt-contrib-livescript');
	grunt.loadNpmTasks('grunt-wrap');

	grunt.registerTask('build', 'concat:lib livescript:lib');
	grunt.registerTask('package', 'wrap:node wrap:amd wrap:min copy:qunit');
	grunt.registerTask('nunit', 'test');
	grunt.registerTask('tests', 'livescript:nunit livescript:qunit nunit qunit');
	grunt.registerTask('default', 'clean build package tests');
};
