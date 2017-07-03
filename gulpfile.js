
const gulp 			= require('gulp'),
	sass 			= require('gulp-ruby-sass'),
	autoprefixer 	= require('gulp-autoprefixer'),
	minifycss 		= require('gulp-minify-css'),
	uglify 			= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'),
	rename 			= require('gulp-rename'),
	clean 			= require('gulp-clean'),
	concat 			= require('gulp-concat'),
	notify 			= require('gulp-notify'),
	cache 			= require('gulp-cache'),
	order 			= require('gulp-order'),
	runSequence 	= require('run-sequence').use(gulp);

// Styles
gulp.task('styles', function() {
	return sass('src/stylesheets/style.scss', {style: 'expanded'})
			.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
			.pipe(gulp.dest('public/stylesheets'))
			.pipe(rename({ suffix: '.min' }))
			.pipe(minifycss())
			.pipe(gulp.dest('public/stylesheets'))
			.pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
	return gulp.src('src/javascripts/**/*.js')
		.pipe(order([
				'jquery-3.2.1.js',
				'bootstrap.js',
				'script.js',
				'*.js'
			]))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('public/javascripts'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('public/javascripts'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('public/images'))
		.pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
	return gulp.src(['public/stylesheets', 'public/javascripts', 'public/images'], {read: false})
		.pipe(clean());
});

// Watch
gulp.task('watch', function() {
	// Watch .scss files
	gulp.watch('src/stylesheets/**/*.scss', ['styles']);

	// Watch .js files
	gulp.watch('src/javascripts/**/*.js', ['scripts']);

	// Watch image files
	gulp.watch('src/images/**/*', ['images']);

});

// Default task
gulp.task('default', ['clean'], function() {
	runSequence('styles', 'scripts', 'images', 'watch');
});