(function (the, $) {

  // pop
  var moment = require('moment');
  var now = moment();
  var dateString = now.format('YYYY-MM-DD');

  var popDate = function () {
    var noty = require('noty');
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

    noty({
      text: template,
      type: 'alert',
      layout: 'topRight',
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

  $('#editor').text(hostsText).on('keydown', function (e) {

    var editor = this;

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

    if (!e.ctrlKey) {
      return;
    }
    switch (e.keyCode) {
      case 80:// P
        var marked = the('marked');
        marked.setOptions({
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: true,
          smartLists: true,
          smartypants: false
        });
        console.log(marked(sourceCode));
      case 83:// S
        console.log(sourceCode)
        ;
    }
  });


})(function (module) {
  return require('remote').require(module);
}, require('jQuery'))

