/**
 * Created by MurphyL on 15/10/31.
 */
module.exports = function () {
  /**
   * 广播事件
   * @param name
   * @param data
   */
  var emit = function (name, data) {
    if (!name || name.trim() === '') {
      throw new ReferenceError('Event name can not empty', $.now());
    }
    var event = document.createEvent('HTMLEvents');
    event.initEvent(name, true, true);
    event.data = data;
    document.dispatchEvent(event);
  };
  /**
   * 监听事件
   * @param name
   * @param callback
   */
  var listen = function (name, callback) {
    if (!name || name.trim() === '') {
      throw new ReferenceError('Event name can not empty', $.now());
    }
    if (!callback && typeof callback !== 'function') {
      throw new TypeError('Need a callback function', $.now());
    }
    document.addEventListener(name, function (e) {
      callback(e);
    }, false);
  };
  /**
   * 读写 localStorage
   * @param key
   * @param val
   */
  var cache = function (key, val) {
    var dataId = key + '@' + dateString;
    if (val) {
      return localStorage.setItem(dataId, val);
    }
    return localStorage.getItem(dataId);
  };
  // 挂到 window 对象上
  window.emit = emit;
  window.listen = listen;
  window.cache = cache;
}
