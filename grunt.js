/*global module:false*/
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: '<json:package.json>',
		meta: {
			banner: '// <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
				'<%= pkg.homepage ? "// " + pkg.homepage + "\n" : "" %>' +
				'// Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
				' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>'
		},
		clean: {
			app: {
				src: ["docs", "dist"]
			}
		},
		lint: {
			files: ['grunt.js', 'src/**/*.js']
		},
		docco: {
			app: {
				src: ['src/*js']
			}
		},
		qunit: {
			files: ['test/*.html']
		},
		coffee: {
			app: {
				src: ['src/**/*.coffee'],
				dest: 'dist/coffee/'
			}
		},
		concat: {
			dist: {
				src: ['<banner:meta.banner>', 'src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		min: {
			dist: {
				src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		watch: {
			app: {
				files: ['src/**/*.js'],
				tasks: ['default']
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true
			},
			globals: {
				jQuery:false,
				JEFRi:false,
				UUID: false,
				_:false,
				window: false,
				XMLHttpRequest: false
			}
		},
		uglify: {}
	});

	grunt.loadNpmTasks('grunt-contrib');
	grunt.loadNpmTasks('grunt-docco');

	grunt.registerTask('default', 'clean lint docco concat min qunit');
};
