const $ = jQuery = require('jQuery');

var fs = require('fs');
var url = require('url');
var noty = require('noty');
var sh = require('shelljs');
var rest = require('unirest');
var moment = require('moment');
var now = moment();
var dateString = now.format('YYYY-MM-DD');

// 加载配置信息
var env = require('../js/conf.json');
// 初始化常用工具
require('../js/utils.js')();
// 弹出天气信息,日历
require('../js/alert.js')();
// 初始化编辑器
var editor = require('../js/editor.js')();
// 加载Hosts文件
require('../js/hosts.js')();
// 方案选择器
require('../js/switcher.js');


/*

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
 if (e.keyCode === 27) {
 editor.val(editor.data('editor_hosts_cached'));
 editor.removeAttr('style');
 otherHosts = [];
 hitsHosts = [];
 if (window['saveNoty']) {
 saveNoty.close()
 }
 }
 if (!e.ctrlKey) {
 return;
 }
 switch (e.keyCode) {
 case 70:// F
 if (editor.attr('style')) {
 if (window['saveError'] && !window['saveError']['closed']) {
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
 if (otherHosts.length == 0 && hitsHosts.length == 0) {
 break;
 }
 var editedText = editor.val()
 var otherHostsText = otherHosts.join('\n');
 if (otherHosts.length == 0) {
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

 var filterEditorContent = function (text) {
 var hosts = editor.data('editor_hosts_cached');
 editor.data('history', hosts);
 var hostRows = hosts.split('\n');
 window.hitsHosts = [];
 window.otherHosts = [];
 var regex = new RegExp(text);
 for (var i in hostRows) {
 var row = hostRows[i].trim();
 if (row === '') {
 continue;
 }
 if (!/^#/.test(row) && regex.test(row)) {
 window.hitsHosts.push(row);
 } else {
 window.otherHosts.push(row);
 }
 }
 return window.hitsHosts;
 };

 $('#search').on('keyup', function (e) {
 if (e.keyCode === 27) {// ESC
 $('.search').hide().val('');
 editor.focus();
 return;
 }
 var val = this.value.trim();
 if (e.keyCode === 8 && val === '') {
 editor.val(editor.data('editor_hosts_cached'));
 return;
 }
 if (val === '') {
 return;
 }
 if (e.keyCode === 13) {// Enter
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
 if ($(this).data('history') === val) {
 return;
 }
 // 过滤数据，并存储
 var hits = filterEditorContent(val);
 editor.val(hits.join('\n'));
 $(this).data('history', val);
 });

 */


