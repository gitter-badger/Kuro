/**
 * Created by MurphyL on 15/10/31.
 */

var alertCalendar = function () {
  var year = now.format('YYYY');
  var alertSource = $('#weather-wrapper-template').text();
  alertSource = alertSource.replace(/#DATE#/g, now.format('D'));
  alertSource = alertSource.replace(/#MONTH#/, now.format('M'));
  alertSource = alertSource.replace(/#YEAR#/g, year);
  alertSource = alertSource.replace(/#DAY_OF_YEAR#/, now.dayOfYear());
  alertSource = alertSource.replace(/#WEEK_OF_YEAR#/, now.week());
  // 弹出
  noty({
    text: alertSource,
    type: 'alert',
    layout: 'topRight',
    closeWith: [],
    theme: 'relax'
  });
  // 修改弹出层样式
  $('#noty_topRight_layout_container')
    .on('cut, copy, selectstart', function () {
      return false;
    })
    .css('cursor', 'pointer');
};

var fillWeatherData = function (weather) {
  var weatherCode, weatherText;
  var hour = now.format('H');
  if (hour < 6 || hour > 18) {
    weatherCode = weather.code_n;
    weatherText = weather.txt_n;
  } else {
    weatherCode = weather.code_d;
    weatherText = weather.txt_d;
  }
  var iconUrl = '../img/weather/' + weatherCode + '.png';
  $('#weather-icon').attr('src', iconUrl);
  $('#weather-text').text(weatherText);
  var qlty = weather.brf + '，空气质量' + weather.qlty;
  if(qlty.length < 10){
    qlty = '（' + weather.city + '）' + qlty;
  }
  $('#weather-qlty').text('。' + qlty);
  $('.weather-placeholder').hide();
  $('.weather-data').show();
};

var tips = function () {
  // 弹出日历
  alertCalendar();
  var weather = cache('weather-data');
  if(weather){
    return fillWeatherData(JSON.parse(weather));
  }
  // 查询外网 ip,然后使用 ip 查询天气情况
  rest.get(env['httpbin_service_url']).end(function (response) {
    response.ok && emit('got_remote_ip', response.body['origin']);
  });
};

/**
 * 获取和风天气查询服务地址
 * @param cityIP
 * @returns {*}
 */
tips.getHefengServiceUrl = function (cityIP) {
  return url.format({
    protocol: 'https',
    hostname: env['hefeng_service_url'],
    query: {
      cityip: cityIP,
      key: env['hefeng_secret_key']
    }
  });
};


/**
 * 处理天气等信息
 * @param hefengData
 */
tips.dealWeatherInfo = function (hefengData) {
  if (!hefengData) {
    return;
  }
  for (var key in hefengData) {
    if (hefengData[key] && hefengData[key].length > 0) {
      var weatherData = hefengData[key][0];
      if (weatherData['status'] !== 'ok') {
        continue;
      }
      try {
        var dailyForecast = weatherData['daily_forecast'][0]['cond'];
        var weather = {
          qlty: weatherData['aqi']['city']['qlty'],
          brf: weatherData['suggestion']['drsg']['brf'],
          city: weatherData['basic']['city'],
          code_d: dailyForecast['code_d'],
          txt_d: dailyForecast['txt_d'],
          code_n: dailyForecast['code_n'],
          txt_n: dailyForecast['txt_n']
        };
        fillWeatherData(weather);
        cache('weather-data', JSON.stringify(weather));
      } catch (e) {
        console.log('Opus, something error...', e);
      }
    }
  }
  console.log('weather data', hefengData);
};

/**
 * 查询天气数据
 * @param localIP
 */
tips.fetchWeatherData = function (localIP) {
  rest.post(tips.getHefengServiceUrl(localIP))
    .end(function (response) {
      // 处理天气数据
      tips.dealWeatherInfo(response.body);
    });
};

/**
 * 弹出天气信息
 */
listen('weather_info_processed', function (e) {
  e.data && tips.alertDateAndWeather(e.data);
});

/**
 * 成功获得到本机远程ip
 */
listen('got_remote_ip', function (e) {
  e.data && tips.fetchWeatherData(e.data);
});

listen('alert_data_and_weather', function (e) {
  tips.alertDateAndWeather();
})

module.exports = tips;
