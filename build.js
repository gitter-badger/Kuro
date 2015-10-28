require('shelljs/global');

var libHome = 'app/assets/lib/';

if (!test('-d', libHome)) {
  mkdir(libHome);
}

var modulesHome = 'node_modules/';

// zepto
cp('-Rf', modulesHome + 'zepto/zepto.min.js', libHome);

// font-awesome
var fontAwesomeHome = libHome + 'font-awesome/';

if (!test('-d', libHome + 'fa')) {
  mkdir(fontAwesomeHome);
  mkdir(fontAwesomeHome + 'css/');
  mkdir(fontAwesomeHome + 'fonts/');
}

cp('-Rf', modulesHome + 'font-awesome/css/*.min.css', fontAwesomeHome + 'css/');
cp('-Rf', modulesHome + 'font-awesome/fonts/*', fontAwesomeHome + 'fonts/');

console.log('All right!\n');

