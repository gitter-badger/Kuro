var Datastore = require('nedb')
  , db = new Datastore();


// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'app/data/datafile.db' });
db.loadDatabase(function (err) {    // Callback is optional
  console.log(err)
});
