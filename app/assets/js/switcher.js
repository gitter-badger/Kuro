/**
 * Created by MurphyL on 15/11/2.
 */

var alertProjectSwitcher = function () {
  noty({
    text: $('#project-swither-template').text(),
    type: 'alert',
    layout: 'topRight',
    closeWith: [],
    theme: 'relax'
  });
  $('#project-switcher').click(function () {
    console.log(1)
    $(this).find('.arrow')
      .toggleClass('fa-caret-up')
      .toggleClass('fa-caret-down');
    var list = $('#projects');
    if (list.length > 0) {
      if (list.is(':visible')) {
        list.parent('li').slideUp(70);
      } else {
        list.parent('li').slideDown(50);
      }
    } else {
      var listSrc = $('#project-list-template').text();
      $(this).closest('li').after(listSrc);
      $('#projects').slideDown();
    }
  });
};

alertProjectSwitcher();
