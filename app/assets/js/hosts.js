/**
 * Created by MurphyL on 15/10/31.
 */
var gbk = require('gbk');
// hosts
var hostsFilePath = '/etc/hosts';
//'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
if (process.platform === 'win32') {
  hostsFilePath = process.env['windir'] + '/System32/drivers/etc/hosts';
}

var hosts = function () {
  emit('hosts_file_required')
};

// 加载hosts文件
hosts.load = function () {
  fs.readFile(hostsFilePath, function (err, data) {
    !err && emit('hosts_file_loaded', data);
  });
};

// 写入hosts文件
hosts.save = function (data) {
  fs.writeFile(hostsFilePath, data, function (err) {
    if (err) {
      throw err;
    } else {
      emit('hosts_file_saved');
      console.log('It\'s saved!');
    }
  });
};

/*
var dealHostRow = function (row) {
  // 整行注释
  if(/^#/.test(row)){
    return '<li><i class="comment">' + row + '</i></li>';
  } else {
    var comment;
    // 处理行间注释,多个注释拼合为一个
    if(/#+/.test(row)){
      var comments = row.split(/#+/);
      row = comments.shift().trim();
      comments = comments.map(function(text){
        return text.trim();
      });
      comment = comments.join(' ');
    }
    var html = '';
    // 截断 host 记录
    row.split(/\s+/).forEach(function(text, index){
      html += ('<span>' + text + '</span>');
    })
    // 拼合 host 记录和行间注释
    if(comment){
      html += ('<i class="comment"># ' + comment + '</i>');
    }
    return '<li>' + html + '</li>';
  }
};*/

/**
 * 需要加载Hosts文件
 */
listen('hosts_file_required', function () {
  hosts.load();
});

/**
 * Hosts文件已经加载成功
 */
listen('hosts_file_loaded', function (e) {
  /*var html = '';
  e.data.split('\n').forEach(function (text, index) {
    html += dealHostRow(text.trim());
  });*/;
  editor.setValue(gbk.toString('utf-8', e.data));
});

/**
 * 更新DNS
 */
listen('hosts_file_saved', function (e) {
  if (process.platform === 'win32') {
    sh.exec('ipconfig/flushdns');
    console.log('DNS refreshed!');
  }
});

module.exports = hosts;

