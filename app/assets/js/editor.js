/**
 * Created by MurphyL on 15/10/31.
 */

module.exports = function(){
  return CodeMirror.fromTextArea(document.getElementById("editor"), {
    hint: true,
    mode: 'hosts',
    autohint: true,
    dragDrop: true,
    autofocus: true,
    smartIndent: false,
    lineNumbers: false,
    lineWrapping: true,
    indentWithTabs: true,
    styleActiveLine: true,
    extraKeys: {
      'Ctrl-F': function(){
        $('.CodeMirror-line').removeClass('hidden');
        $('.search')
          .val('')
          .show()
          .focus();
      },
      'Ctrl-Q': function () {
        /*layer.open({
         type: 1,
         title: false,
         closeBtn: false,
         skin: 'layui-layer-rim', //加上边框
         offset: ['20%'],
         area: ['600px', '400px'], //宽高
         content: 'html内容'
         });*/
      },
      'Ctrl-S': function(){
        $('.CodeMirror-line').removeClass('hide');
        $('.CodeMirror, #editor').removeClass('error');
      }
    },
    scrollbarStyle: "native"
  })
};

$('.search').on('keyup', function(e){
  if(e.keyCode !== 13 && e.keyCode !== 27) {
    return true;
  }
  if(e.keyCode === 13 && this.value.trim() === ''){
    console.log('搜索字段为空');
    return;
  }
  if(e.keyCode === 13){ // Enter
    var index = 0;
    var query = $('.search:input').val();
    $('.CodeMirror-line').each(function(i, o){
      if(o.innerText.indexOf(query) === -1){
        $(o).addClass('hide');
      } else {
        index ++;
      }
    });
    index && $('.CodeMirror, #editor').addClass('error');
  }
  editor.scrollTo(0, 0);
  $('.search').val('').hide();
  editor.focus();
});

