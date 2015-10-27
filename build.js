require('shelljs/global');

var libHome = 'app/assets/lib/';

if (!test('-d', libHome)) {
  mkdir(libHome);
}

// 拷贝静态资源
if (test('-e', 'assets.json')) {
  var assets = require('./assets');
  for (var file in assets) {
    cp('-Rf', assets[file], libHome)
  }
}

console.log('All right!\n');

