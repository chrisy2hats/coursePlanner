const mysql = require('mysql2/promise');

const config = require('./config.json');


//Insert functions
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
async function addWeek(courseName, topics, notesAndIdeas, resources) {
    const sql = await init();
    const insertquery = sql.format('insert into weeks set ? ;', {
        courseName,
        topics,
        notesAndIdeas,
        resources
    });
    await sql.query(insertquery);
}
module.exports.addWeek = addWeek;

//Retrieve functions
/*
Used to populate dropdown
TODO should be changed to getNamesOfCoursesByName
*/
async function selectWeeksByCourse(courseName){

    console.log("selectWeeksByCourse called");
    const sql = await init();
    const query = sql.format(`select * from weeks where courseName =?`,courseName);
    const resultOfQuery = await sql.query(query);
    // console.log("resultOfQuery: "+resultOfQuery);
    // console.log("resultOfQuery: "+resultOfQuery[0]);
    // console.log("resultOfQuery: "+resultOfQuery[0].courseID);
    // console.log("resultOfQuery" + resultOfQuery.length);
    return resultOfQuery;
    //TODO depreciated
}
module.exports.selectWeeksByCourse = selectWeeksByCourse;

async function getWeek(courseName,weekNumber){
    const sql = await init();
    const query = sql.format(`select topics,notesAndIdeas,resources from weeks where courseName = ? and weekNumber = ?`,[courseName,weekNumber]);
    const resultOfQuery = await sql.query(query);
    console.log("resultOfQuery"+resultOfQuery);
    return resultOfQuery[0];
}
module.exports.getWeek = getWeek;
/*
TODO
*/
async function getNumberOfWeeksInACourse(courseName){
    const sql = await init();
    const query = sql.format(`select count(weekNumber) as numOfWeeks from weeks where courseName =?`,courseName);
    const resultOfQuery= await sql.query(query);
    return resultOfQuery;
}
module.exports.getNumberOfWeeksInACourse = getNumberOfWeeksInACourse;


/*
TODO
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

function tests() {
    console.log("Running database tests");
    addCourse("WEBF1","up000000@myport.ac.uk",5);
    addCourse("WEBF1","up809059@myport.ac.uk",5);
    addCourse("WEBSCRIPT","up809059@myport.ac.uk",9);
    // addCourse(15);
    addWeek(2, "foo", "foobar", "bar");
    retrieveCoursesByEmail("up000000@myport.ac.uk");
    retrieveCoursesByEmail("up001000@myport.ac.uk");
    retrieveCoursesByEmail("up000000@myport.ac.uk");
    getWeek("WEBF1",1);
}
async function temp(){

    // getNumberOfWeeksInACourse("WEBF1"));
    // console.log(x);
    // console.log(x[0]);
    // console.log(x[0][0]);
    // console.log(x[0][0]);
    // console.log(x.count\(weekNumber\)

}
    // console.log(await selectWeeksByCourse("WEBF1"));
    // addWeek("WEBF1", "foo", "foobar", "bar");
    // addWeek("WEBSCRIPT", "foo", "foobar", "bar");
    // addWeek("WEBF1", "Topics stuff", "Notes", "resourcesss");
    // addWeek("WEBF1", "Topics stuff", "Notes", "resourcesss");
    // addCourse("WEBF1","up000000@myport.ac.uk",5);
    // addCourse("WEBF1","up809059@myport.ac.uk",5);
    // addCourse("WEBSCRIPT","up809059@myport.ac.uk",9);

temp();
    // courseName = "WEBF1";
    // weekNumber = 1;
 // tests();
