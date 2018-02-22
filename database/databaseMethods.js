console.log("Database methods called");

const mysql = require('mysql2/promise');

// const config = require('./config.json');
const config = require('./testConfig.json');

async function connectionTester(testColumn){
	// console.log("connectionTester called");
	const sql = await init();
    const insertquery = sql.format('insert into testTable set ? ;', {
	    testColumn
    });
    await sql.query(insertquery);
}
module.exports.connectionTester = connectionTester;

//Boilerplate code for mysql connections
//Functions taken from sql-contact-list in examples week 11

let sqlPromise = null;

async function init() {
    if (sqlPromise) return sqlPromise;

    sqlPromise = newConnection();
    return sqlPromise;
}

async function newConnection() {
    // todo: this should really use connection pools
    const sql = await mysql.createConnection(config.mysql);
// 	console.log("newConnection called");
// 	const sql = await mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'testDatabase',
//   table: 'testTable'
// });
//const sql = await mysql.createConnection(config.mysql);
console.log("Connection made");

    // handle unexpected errors by just logging them
    sql.on('error', (err) => {
        console.error("sqlError: "+err);
        sql.end();
    });

    return sql;
}
connectionTester("foo");
