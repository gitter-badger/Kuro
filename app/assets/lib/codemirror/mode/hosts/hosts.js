// mirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://mirror.net/LICENSE

(function(mirror) {
  "use strict";

  mirror.defineMode("hosts", function() {
    return {
      token: function(stream, state) {
        if (stream.peek() === "#") {
          stream.skipToEnd();
          return "comment";
        }
        if (/#/.test(stream.string)) {
          stream.skipTo('#');
        } else {
          stream.skipToEnd();
        }
        return "string";
      }
    };
  });

  mirror.commands.autocomplete = function (cm) {
     mirror.showHint(cm, CodeMirror.hint.html);
  };

  mirror.defineMIME("message/hosts", "hosts");

})(CodeMirror);
