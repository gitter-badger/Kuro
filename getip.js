var http = require('http');

http.get('http://httpbin.org/ip', function(res){
	var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      console.log(data);
    });
});