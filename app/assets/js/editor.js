/**
 * Created by MurphyL on 15/10/31.
 */

var clipboard = require('clipboard');

var init = function(){};

editor.on('copy', function(e){
  setTimeout(function(){
    emit('user_trigger_copy');
  }, 50)
});


listen('user_trigger_copy', function () {
  var selection = clipboard.readHtml('selection')
  var text = '';
  var rows = $(selection).find('li');
  rows.each(function(index, li){
    if(index > 0){
      text += '\n';
    }
    $(li).find('span, i').each(function(seq, item){
      if(seq > 0){
        text += '\t';
      }
      text += item.innerText;
    });
  });
  clipboard.writeText(text);
})

module.exports = init;
