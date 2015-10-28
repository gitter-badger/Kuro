(function (the) {

  var tab = '   ';
  var tw = tab.length;

  $('#editor').on('keydown', function (e) {

    var editor = this;

    // 编辑器的内容
    var sourceCode = this.value;

    // 处理 tab
    if(e.keyCode === 9){
      var selectionStart = editor.selectionStart;
      var selectionEnd = editor.selectionEnd;
      var before = sourceCode.substring(0, selectionStart);
      var after = sourceCode.substring(selectionEnd);

      if(e.shiftKey){
        var shiftIndex = selectionStart - 3;
        var shiftTxt = sourceCode.substring(shiftIndex, selectionStart);
        if(shiftTxt.indexOf('\n') < 0 && shiftTxt.trim() === ''){
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
})

