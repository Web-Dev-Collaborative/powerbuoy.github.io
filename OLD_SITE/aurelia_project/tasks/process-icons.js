import gulp from 'gulp';
import fontello from 'gulp-fontello';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import project from '../aurelia.json';

export function downloadIcons () {
	return gulp.src(project.paths.icons)
		.pipe(fontello())
		.pipe(gulp.dest(project.paths.output + 'icons/'));
}

export function rewriteIconCSS () {
	var afterClass = 'icon--after';

	var baseFind = /\[class\^="icon-"\]:before, \[class\*=" icon-"\]:before/g;
	var baseReplace = '[class^="icon-"]:before, [class*=" icon-"]:before,\n[class^="icon-"]:after, [class*=" icon-"]:after';

	var iconFind = /\.icon-(.*?):before {(.*?)}/g;
	var iconReplace = '.icon-$1:before {$2}\n.icon-$1.' + afterClass + ':before {content: normal}\n.icon-$1.' + afterClass + ':after {$2}';

	var pathFind = /\.\.\/font\/fontello/g;
	var pathReplace = 'scripts/icons/font/fontello';

	return gulp.src('scripts/icons/css/fontello.css')
		.pipe(replace(baseFind, baseReplace))
		.pipe(replace(iconFind, iconReplace))
		.pipe(replace(pathFind, pathReplace))
		.pipe(rename('icons.scss'))
		.pipe(gulp.dest(project.paths.sass));
}

export function generateIconVars () {
	var find = /\.icon-(.*?):before \{ content: '(.*?)'; \} \/\*.*?\*\//g;
	var rep = '\$icon-$1: "$2";';

	return gulp.src('scripts/icons/css/fontello-codes.css')
		.pipe(replace(find, rep))
		.pipe(rename('icon-vars.scss'))
		.pipe(gulp.dest(project.paths.sass));
}
