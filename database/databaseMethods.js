const mysql = require('mysql2/promise');

const config = require('./config.json');


//Insert functions
/*
TODO explaination
*/
async function addCourse(courseName, ownerEmail) {
    const sql = await init();
    const insertquery = sql.format('insert into courses set ? ;', {
        courseName,
        ownerEmail,
    });
    await sql.query(insertquery);
}
module.exports.addCourse = addCourse;

/*
TODO explaination
*/
async function addWeek(weekNumber, courseName) {
    const sql = await init();
    const insertquery = sql.format('insert into weeks set ? ;', {
        weekNumber,
        courseName
    });
    await sql.query(insertquery);
}
module.exports.addWeek = addWeek;

//Update functions
/*

*/
async function updateWeek(weekNumber, courseName, topics, notesAndIdeas, resources) {
    const sql = await init();
    const query = sql.format(`update weeks set topics=?, notesAndIdeas =?, resources =? where weekNumber = ? and courseName = ? `, [topics, notesAndIdeas, resources, weekNumber, courseName]);
    await sql.query(query);
}
module.exports.updateWeek = updateWeek;


async function updateCourse(newCourseName, newOwnerEmail) {
    //TODO
}


//Retrieve functions
/*

*/
async function getWeek(courseName, weekNumber) {
    const sql = await init();
    const query = sql.format(`select topics,notesAndIdeas,resources from weeks where courseName = ? and weekNumber = ?`, [courseName, weekNumber]);
    const resultOfQuery = await sql.query(query);
    if (resultOfQuery[0].length == 0) {
        console.error("ERROR code : databaseMethods.js04 : no data for week: " + weekNumber + " on course: " + courseName);
        return "{}";
    }
    return resultOfQuery[0];
}
module.exports.getWeek = getWeek;

/*
TODO
*/
async function getNumberOfWeeksInACourse(courseName) {
    const sql = await init();
    const query = sql.format(`select count(weekNumber) as numOfWeeks from weeks where courseName =?`, courseName);
    const resultOfQuery = await sql.query(query);
    return resultOfQuery;
}
module.exports.getNumberOfWeeksInACourse = getNumberOfWeeksInACourse;

/*
 This function (retrieveCoursesByEmail)
 @params ownerEmail The email address which will be searched in the database for ownership of courses
 @return {object} An object contained the names of ALL courses associated with the input user.
*/
async function retrieveCoursesByEmail(ownerEmail) {
    const sql = await init();
    const query = sql.format(`select courseName from courses where ownerEmail = ?`, ownerEmail);
    const [resultOfQuery] = await sql.query(query);
    if (resultOfQuery.length == 0) {
        console.error("ERROR code : databaseMethod.js03 : No courses assosiated with email: " + ownerEmail);
        return ("ERROR code : databaseMethod.js03 : No courses assosiated with email: " + ownerEmail);
    }
    return (resultOfQuery);
}
module.exports.retrieveCoursesByEmail = retrieveCoursesByEmail;


//Boilerplate code for mysql connections
/*
 This function (connectionTester) attempts to make a connection to the database. If the database is succesful it does nothing.
 If the connection to the database fails it should output an error message and stop the entire server.
 This function should not be needlessly exported by should be run at the bottom of this file so when the main server starts it runs this file and tests the connection.
*/
async function connectionTester() {
    try {
        const sql = await init();
    } catch (e) {
        console.error("ERROR code : databaseMethods.js01 : Cannot connect to database. Check config file has the correct credentials and that MySQL daemon is running.Exiting now.");
        process.exit(1);
    }
}

//Functions taken from sql-contact-list in examples week 11    // console.log(await selectWeeksByCourse("WEBF1"));

let sqlPromise = null;

async function init() {
    if (sqlPromise) return sqlPromise;

    sqlPromise = newConnection();
    return sqlPromise;
}

async function newConnection() {
    // todo: this should really use connection pools
    const sql = await mysql.createConnection(config.mysql);


    // handle unexpected errors by just logging them
    sql.on('error', (err) => {
        console.error("ERROR code: databaseMethods.js02: " + err);
        sql.end();
    });
    return sql;
}

connectionTester();
console.log("Database methods successfully imported.");
