var Request = require('unirest').get('http://httpbin.org/ip').end(function (response) {
  console.log(response.body['origin']);
})