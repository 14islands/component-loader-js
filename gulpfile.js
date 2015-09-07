var gulp        = require('gulp');

var babel       = require('gulp-babel');
var del         = require('del');
var rename      = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify      = require('gulp-uglify');


// Configuration
config = {
	production: true, // default unless target 'set-development' is used

	jsSourceDir: './src/',
	jsSourceEntryFilename: 'component-loader.js',
	jsOutputDir: './dist/'
};


gulp.task('clean', function (callback) {
	del([
		'dist/*',
	], callback);
});


gulp.task('compile-js', function() {
	return gulp.src(config.jsSourceDir + '/**/*.js')
		.pipe(babel())
		.pipe(rename({
			extname: ".es5.js"
		}))
		.pipe(gulp.dest(config.jsOutputDir + '/es5/'));
});


gulp.task('copy-es6', function(){
	return gulp.src(config.jsSourceDir + '/**/*.js')
		.pipe(rename({
			extname: ".es6.js"
		}))
		.pipe(gulp.dest(config.jsOutputDir + '/es6/'));
});


gulp.task('compress', function() {
	return gulp.src(config.jsOutputDir + '/**/*.js')
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(gulp.dest(config.jsOutputDir));
});


///////////////////////////////////////////////////////////////////////////////
// BUILD - FOR PRODUCTION
///////////////////////////////////////////////////////////////////////////////
gulp.task('build', ['clean'], function(callback) {
	runSequence('compile-js',
	            'compress',
	            'copy-es6',
	            callback);
});

gulp.task('default', ['build']);
