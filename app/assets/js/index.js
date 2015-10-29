(function (the, $) {

  // pop
  var moment = require('moment');
  var now = moment();
  var dateString = now.format('YYYY-MM-DD');

  var popDate = function () {
    var year = now.format('YYYY');
    var template = $('#date-template').text();

    template = template.replace(/#DATE#/g, now.format('D'));
    template = template.replace(/#MONTH#/, now.format('M'));
    template = template.replace(/#YEAR#/g, year);
    template = template.replace(/#DAY_OF_YEAR#/, now.dayOfYear());
    template = template.replace(/#WEEK_OF_YEAR#/, now.week());
    template = template.replace(/#QLTY#/, getStorageData('weather_qlty'));
    template = template.replace(/#WEATHER#/, getStorageData('weather_brf'));
    template = template.replace(/#CITY#/, getStorageData('weather_city'));

    var hour = now.format('H');
    var weatherCode, weatherText;
    if(hour < 6 || hour > 18){
      weatherCode = getStorageData('weather_n_code');
      weatherText = getStorageData('weather_n_text');
    } else {
      weatherCode = getStorageData('weather_d_code');
      weatherText = getStorageData('weather_d_text');
    }
    template = template.replace(/#W_CODE#/, weatherCode);
    template = template.replace(/#W_TEXT#/, weatherText);

    require('noty')({
      text: template,
      type: 'alert',
      layout: 'topRight',
      closeWith: [],
      theme: 'relax'
    });
  };

  var dealWeatherData = function(data){
    if(!data){
      return;
    }
    for(var key in data){
      if(data[key] && data[key].length > 0){
        var weatherData = data[key][0];
        if(weatherData['status'] !== 'ok'){
          return;
        }
        console.log(weatherData)
        var qlty = weatherData['aqi']['city']['qlty'];
        localStorage.setItem('weather_qlty' + '_' + dateString, qlty);
        var brf = weatherData['suggestion']['drsg']['brf'];
        localStorage.setItem('weather_brf' + '_' + dateString, brf);
        var city = weatherData['basic']['city'];
        localStorage.setItem('weather_city' + '_' + dateString, city);
        var dailyForecast = weatherData['daily_forecast'][0]['cond'];
        var dailyWeatherCode = dailyForecast['code_d'];
        localStorage.setItem('weather_d_code' + '_' + dateString, dailyWeatherCode);
        var dailyWeatherTxt = dailyForecast['txt_d'];
        localStorage.setItem('weather_d_text' + '_' + dateString, dailyWeatherTxt);
        var nightWeatherCode = dailyForecast['code_n'];
        localStorage.setItem('weather_n_code' + '_' + dateString, nightWeatherCode);
        var nightWeatherTxt = dailyForecast['txt_n'];
        localStorage.setItem('weather_n_text' + '_' + dateString, nightWeatherTxt);
        // pop
        popDate();
      }
    }
  };

  var getStorageData = function(key){
    var dataId = key + '_' + dateString;
    return localStorage.getItem(dataId);
  }

  var fetchWeathData = function(){
    var qlty = getStorageData('weather_qlty');
    var brf = getStorageData('weather_brf');
    var city = getStorageData('weather_city');
    var hour = now.format('H');
    var weatherCode, weatherText;
    if(hour < 6 || hour > 18){
      weatherCode = getStorageData('weather_n_code');
      weatherText = getStorageData('weather_n_text');
    } else {
      weatherCode = getStorageData('weather_d_code');
      weatherText = getStorageData('weather_d_text');
    }
    if(qlty && brf && city && weatherCode && weatherText){
      popDate();
      return;
    }
    var rest = require('unirest');
    rest.get('http://httpbin.org/ip').end(function (response) {
      if(!'origin' in response.body){
        return;
      }
      var localIP = response.body['origin'];
      var serviceUrl = 'https://api.heweather.com/x3/weather?';
      var secretKey = 'key=56f74113649f43b8ba28ba316a8377d8';
      rest.post(serviceUrl + secretKey + '&cityip=' + localIP)
      .end(function(response){
        dealWeatherData(response.body);
      });
    })
  }

  try {
    fetchWeathData();
  } catch (e){
    console.log(e);
  }

  // hosts
  var hosts = process.env['windir'] + '/System32/drivers/etc/hosts';
  var hostsText = the('fs').readFileSync(hosts, 'utf-8');

  // editor
  var tab = '   ';
  var tw = tab.length;
  var editor = $('#editor');
  editor.data('editor_hosts_cached', hostsText);

  editor.text(hostsText).on('keyup', function (e) {

    // 编辑器的内容
    var sourceCode = this.value;

    // 处理 tab
    if (e.keyCode === 9) {
      var selectionStart = editor.selectionStart;
      var selectionEnd = editor.selectionEnd;
      var before = sourceCode.substring(0, selectionStart);
      var after = sourceCode.substring(selectionEnd);

      if (e.shiftKey) {
        var shiftIndex = selectionStart - 3;
        var shiftTxt = sourceCode.substring(shiftIndex, selectionStart);
        if (shiftTxt.indexOf('\n') < 0 && shiftTxt.trim() === '') {
          // 当回退的三个字符均为空白字符，且不包含换行
          editor.value = before.substring(0, shiftIndex) + after;
          selectionStart = shiftIndex;
          selectionEnd = shiftIndex;
        }
      } else {
        editor.value = before + tab + after;
        selectionStart += tw;
        selectionEnd = selectionStart;
      }
      // 仅兼容 webkit
      editor.focus();
      editor.setSelectionRange(selectionStart, selectionEnd);
      e.preventDefault();
      return false;
    }
    if(e.keyCode === 27){
      editor.val(editor.data('editor_hosts_cached'));
      editor.removeAttr('style');
      otherHosts = [];
      hitsHosts = [];
      saveNoty.close()
    }
    if (!e.ctrlKey) {
      return;
    }
    switch (e.keyCode) {
      case 70:// F
        if(editor.attr('style')){
          if(window['saveError'] && !window['saveError']['closed']){
            break;
          }
          window.saveError = require('noty')({
            text: '请保存已变更的内容！',
            type: 'error',
            layout: 'topRight',
            timeout: 3000,
            theme: 'relax'
          });
          break;
        }
        $(this).blur();
        $('.search').show().focus();
        break;
      case 80:// P
        console.log(sourceCode);
        break;
      case 83:// S
        console.log('save', e.keyCode, new Date() * 1);
        editor.removeAttr('style');
        if(otherHosts.length == 0 && hitsHosts.length == 0){
          break;
        }
        var editedText = editor.val()
        var otherHostsText = otherHosts.join('\n');
        if(otherHosts.length == 0){
          editor.val(editedText);
        }
        editor.val(otherHostsText + '\n' + editedText);
        editor.data('editor_hosts_cached', editor.val());
        otherHosts = [];
        hitsHosts = [];
        saveNoty.close()
        break;
    }
  });

  var filterEditorContent = function(text){
    var hosts = editor.data('editor_hosts_cached');
    editor.data('history', hosts);
    var hostRows = hosts.split('\n');
    window.hitsHosts = [];
    window.otherHosts = [];
    var regex = new RegExp(text);
    for(var i in hostRows){
      var row = hostRows[i].trim();
      if(row === ''){
        continue;
      }
      if(!/^#/.test(row) && regex.test(row)){
        window.hitsHosts.push(row);
      } else {
        window.otherHosts.push(row);
      }
    }
    return window.hitsHosts;
  };

  $('#search').on('keyup', function (e) {
    if(e.keyCode === 27){// ESC
      $('.search').hide().val('');
      editor.focus();
      return;
    }
    var val = this.value.trim();
    if(e.keyCode === 8 && val === ''){
      editor.val(editor.data('editor_hosts_cached'));
      return;
    }
    if(val === ''){
      return;
    }
    if(e.keyCode === 13){// Enter
      $('.search').hide().val('');
      editor.focus().css({
        border: '1px dashed red'
      });
      window.saveNoty = require('noty')({
        text: '按 Ctrl + S 保存修改的内容，ESC 撤销该操作！',
        type: 'warning',
        layout: 'topRight',
        theme: 'relax'
      });
      console.log(saveNoty);
      return;
    }
    if($(this).data('history') === val){
      return;
    }
    // 过滤数据，并存储
    var hits = filterEditorContent(val);
    editor.val(hits.join('\n'));
    $(this).data('history', val);
  });


})(function (module) {
  return require('remote').require(module);
}, require('jQuery'))

