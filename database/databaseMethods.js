const mysql = require('mysql2/promise');

const config = require('./config.json');

/*
TODO explaination
*/
async function connectionTester() {
    try {
        const sql = await init();
    } catch (e) {
        console.error("ERROR code : databaseMethods.js01 : Cannot connect to database. Check config file has the correct credentials and that MySQL daemon is running.Exiting now.");
        process.exit(1);
    }
}
module.exports.connectionTester = connectionTester;

/*
TODO explaination
*/
async function addCourse(courseName,ownerEmail,numberOfWeeks) {
    const sql = await init();
    const insertquery = sql.format('insert into courses set ? ;', {
        courseName,
        ownerEmail,
        numberOfWeeks
    });
    await sql.query(insertquery);
}
module.exports.addCourse = addCourse;

/*
TODO explaination
*/
async function addWeek(courseID, topics, notesAndIdeas, resouces) {
    const sql = await init();
    const insertquery = sql.format('insert into weeks set ? ;', {
        courseID,
        topics,
        notesAndIdeas,
        resouces
    });
    await sql.query(insertquery);
}
module.exports.addWeek = addWeek;

/*
TODO
Select courses by ID
Select weeks by courses
select All parts of a week. Pass it the week number and course ID return topics notes and resources
*/
async function retrieveCoursesByEmail(ownerEmail){
    const sql = await init();
    const query = sql.format(`select courseName from courses where ownerEmail = ?`, ownerEmail);
    const [resultOfQuery] = await sql.query(query);
    if (resultOfQuery.length == 0){
        console.error("ERROR code : databaseMethod.js03 : No courses assosiated with email: "+ownerEmail);
        return ("ERROR code : databaseMethod.js03 : No courses assosiated with email: "+ownerEmail);
    }
    // console.log("resultOfQuery"+resultOfQuery);
    // // console.log("resultOfQuery"+JSON.parse(resultOfQuery));
    // console.log("resultOfQuery"+resultOfQuery.value);
    // console.log("resultOfQuery"+JSON.stringify(resultOfQuery));

    // return JSON.stringify(resultOfQuery);
    return (resultOfQuery);
}
module.exports.retrieveCoursesByEmail = retrieveCoursesByEmail;



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


    // handle unexpected errors by just logging them
    sql.on('error', (err) => {
        console.error("ERROR code: databaseMethods.js02: " + err);
        sql.end();
    });
    return sql;
}

function tests() {
    console.log("Running database tests");
    addCourse("WEBF1","up000000@myport.ac.uk",5);
    addCourse("WEBF1","up809059@myport.ac.uk",5);
    addCourse("WEBSCRIPT","up809059@myport.ac.uk",9);
    // addCourse(15);
    addWeek(2, "foo", "foobar", "bar");
    retrieveCoursesByEmail("up000000@myport.ac.uk");
    retrieveCoursesByEmail("up001000@myport.ac.uk");
    (retrieveCoursesByEmail("up000000@myport.ac.uk"));
}
 tests();
