var app = require('app');
var BrowserWindow = require('browser-window');


// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function () {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit();
  }
});


// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function () {
  // 创建浏览器窗口。
  var window = new BrowserWindow({
    'width': 1024,
    'height': 768,
    'center': true,
    'min-width': 800,
    'min-height': 600,
    'resizable': true,
    'always-on-top': true
  });

  // 加载应用的 index.html
  window.loadUrl('file://' + __dirname + '/assets/html/index.html');

  // 打开开发工具
  window.openDevTools();

  // 当 window 被关闭，这个事件会被发出
  window.on('closed', function () {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    window = null;
  });
});
