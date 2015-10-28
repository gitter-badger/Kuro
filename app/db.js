var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./kuro.db');
var fs = require('fs');

// SELECT name FROM sqlite_master WHERE type='table' AND name='table_name';

db.serialize(function() {

	// db.run("CREATE TABLE lorem (info TEXT)");

	var stmt = db.prepare("CREATE TABLE IF NOT EXISTS project (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, remark TEXT)");

	/*for (var i = 0; i < 10; i++) {
		stmt.run("Ipsum " + i, 'asd');
	}*/

	/*if (!fs.exists('./kuro.db')) {
		stmt.run(['sqlite3.db', './']);
	}*/
	stmt.finalize();

	db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
		console.log(row.id + ": " + row.info);
	});
});

db.close();