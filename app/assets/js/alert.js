/**
 * Created by MurphyL on 15/10/31.
 */

var tips = function(){
  var weatherSource = cache('weather_data_pop_source');
  if (weatherSource) {
    // do pop
    // alertDateAndWeather();
    emit('alert_data_and_weather');
    console.log('fetch canceled');
  } else {
    // 获取本机远程IP,这也是后续事件的源头
    // fetchRemoteIpAddress();
    emit('tips_bootstrap');
  }
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
 * 拼接弹出层数据
 * @param weatherData
 * @returns {*|jQuery}
 */
tips.renderPopSource = function (weatherData) {
  var year = now.format('YYYY');
  var alertSource = $('#date-template').text();
  alertSource = alertSource.replace(/#DATE#/g, now.format('D'));
  alertSource = alertSource.replace(/#MONTH#/, now.format('M'));
  alertSource = alertSource.replace(/#YEAR#/g, year);
  alertSource = alertSource.replace(/#DAY_OF_YEAR#/, now.dayOfYear());
  alertSource = alertSource.replace(/#WEEK_OF_YEAR#/, now.week());
  alertSource = alertSource.replace(/#QLTY#/, weatherData.qlty);
  alertSource = alertSource.replace(/#WEATHER#/, weatherData.brf);
  alertSource = alertSource.replace(/#CITY#/, weatherData.city);
  var hour = now.format('H');
  var weatherCode, weatherText;
  if (hour < 6 || hour > 18) {
    weatherCode = weatherData.code_n;
    weatherText = weatherData.txt_n;
  } else {
    weatherCode = weatherData.code_d;
    weatherText = weatherData.txt_d;
  }
  alertSource = alertSource.replace(/#W_CODE#/, weatherCode);
  alertSource = alertSource.replace(/#W_TEXT#/, weatherText);
  return alertSource;
};

/**
 * 弹出天气等
 * @param weatherData
 */
tips.alertDateAndWeather = function (weatherData) {
  var html;
  if (weatherData) {
    html = tips.renderPopSource(weatherData);
    cache('weather_data_pop_source', html)
  } else {
    html = cache('weather_data_pop_source');
  }
  noty({
    text: html,
    type: 'alert',
    layout: 'topRight',
    closeWith: [],
    theme: 'relax'
  });
  $('#noty_topRight_layout_container')
    .on('cut, copy, selectstart', function () {
      return false;
    })
    .css('cursor', 'pointer');
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
        emit('weather_info_processed', {
          qlty: weatherData['aqi']['city']['qlty'],
          brf: weatherData['suggestion']['drsg']['brf'],
          city: weatherData['basic']['city'],
          code_d: dailyForecast['code_d'],
          txt_d: dailyForecast['txt_d'],
          code_n: dailyForecast['code_n'],
          txt_n: dailyForecast['txt_n']
        });
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
      response.ok && emit('weather_data_fetched', response.body);
    });
};

/**
 * 获取到本机远程ip
 */
listen('tips_bootstrap', function(){
  rest.get(env['httpbin_service_url']).end(function (response) {
    response.ok && emit('got_remote_ip', response.body['origin']);
  });
})

/**
 * 弹出天气信息
 */
listen('weather_info_processed', function (e) {
  e.data && tips.alertDateAndWeather(e.data);
});

/**
 * 成功获取了天气数据
 */
listen('weather_data_fetched', function (e) {
  e.data && tips.dealWeatherInfo(e.data);
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
