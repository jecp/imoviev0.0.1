module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options:{
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['app', 'config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 4000
					},
					cwd: __dirname
				}
			}
		},
		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	})
	grunt.loadNpmTasks('grunt-contrib-watch')
	grunt.loadNpmTasks('grunt-nodemon')
	grunt.loadNpmTasks('grunt-concurrent')
	grunt.option('force', true)
	grunt.registerTask('default',['concurrent'])
}