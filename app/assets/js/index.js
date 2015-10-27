(function (the) {

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

      editor.value = before + '   ' + after;
      editor.selectionStart += 3;
      editor.selectionEnd += 3;

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

