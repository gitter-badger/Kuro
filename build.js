require('shelljs/global');

var libHome = 'app/assets/lib/';

if (!test('-d', libHome)) {
  mkdir(libHome);
}

var modulesHome = 'node_modules/';

// font-awesome
var fontAwesomeDir = libHome + 'font-awesome/';

if (!test('-d', fontAwesomeDir)) {
  mkdir(fontAwesomeDir);
}

var fontAwesomeCssDir = fontAwesomeDir + 'css/';

if (!test('-d', fontAwesomeCssDir)) {
  mkdir(fontAwesomeCssDir);
}
var fontAwesomeFontsDir = fontAwesomeDir + 'fonts/';

if (!test('-d', fontAwesomeFontsDir)) {
  mkdir(fontAwesomeFontsDir);
}

var fontAwesomeLibHome = modulesHome + 'font-awesome/';
cp('-Rf', fontAwesomeLibHome + 'fonts/*', fontAwesomeFontsDir);
cp('-Rf', fontAwesomeLibHome + 'css/*.min.css', fontAwesomeCssDir);


var modulesHome = 'node_modules/';

// font-awesome
var codemirrorDir = libHome + 'codemirror/';

if (!test('-d', codemirrorDir)) {
  mkdir(codemirrorDir);
}

var codemirrorDir = codemirrorDir + 'lib/';

var fontAwesomeFontsDir = fontAwesomeDir + 'fonts/';

if (!test('-d', fontAwesomeFontsDir)) {
  mkdir(fontAwesomeFontsDir);
}

var codemirrorLibHome = modulesHome + 'codemirror/';
cp('-Rf', codemirrorLibHome + 'fonts/*', codemirrorDir);
cp('-Rf', fontAwesomeLibHome + 'css/*.min.css', fontAwesomeCssDir);

console.log('All right!\n');

