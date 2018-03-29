const mysql = require('mysql2/promise');
const config = require('./config.json');


//Insert functions
/*
 This function(addCourse) should insert a new course into the database. Every course has a name and an owner
 @param string courseName - The name of the course
 @param string ownerEmail - The email of the owner of the course
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
 This function (addWeek) should add a new week to an already existsing course.
 @param int weekNumber - The week within the course
 @param string courseName - The name of the course
 @param string ownerEmail - The email of the owner of the course which the week is being added to
*/
async function addWeek(weekNumber, courseName,ownerEmail) {
    console.log("addWeek called");
    const sql = await init();
    const insertquery = sql.format('insert into weeks set ? ;', {
        weekNumber,
        ownerEmail,
        courseName
    });
    await sql.query(insertquery);
}
module.exports.addWeek = addWeek;

//Update functions
/*
 This function(updateWeek) should update the topics,notesAndIdeas and resources fields for an already existing week
 @param int weekNumber - The week within the course
 @param string courseName -  The name of the course
 @param string topics - The contents of the topics field
 @param string notesAndIdeas - The contents of the notesAndIdeas field
 @param string resources - The contents of the resources field
*/
async function updateWeek(weekNumber, courseName, topics, notesAndIdeas, resources) {
    const sql = await init();
    const query = sql.format(`update weeks set topics=?, notesAndIdeas =?, resources =? where weekNumber = ? and courseName = ? `, [topics, notesAndIdeas, resources, weekNumber, courseName]);
    try {
        await sql.query(query);
    } catch (e) {
        console.error("ERROR code : databaseMethods.js11 : Error updating week: " + e);
    }
}
module.exports.updateWeek = updateWeek;

//Retrieve functions
/*
 This function (getWeek) should return the contents of a given week within a given course.
 If there is no data for the week or it doesn't exist an empty JSON object should be returned
 @param string courseName -  The name of the course
 @param int weekNumber -  The week within the course
*/
async function getWeek(courseName, weekNumber) {
    const sql = await init();
    const query = sql.format(`select topics,notesAndIdeas,resources from weeks where courseName = ? and weekNumber = ?`, [courseName, weekNumber]);
    const resultOfQuery = await sql.query(query);
    if (resultOfQuery[0].length == 0) {
        console.error("ERROR code : databaseMethods.js04 : Can't get week : no data for week: " + weekNumber + " on course: " + courseName);
        return "{}";
    }
    return resultOfQuery[0];
}
module.exports.getWeek = getWeek;

/*
 This function(getNumberOfWeeksInACourse) should return the number of weeks within a given course
 @param string courseName - The name of the course
 @return int resultOfQuery - How many weeks are in the course
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
        return ([]);
    }
    return (resultOfQuery);
}
module.exports.retrieveCoursesByEmail = retrieveCoursesByEmail;

//Delete Functions

/*
 This function (deleteWeek) should remove a given week from within a given course from the database
 @param int - weekNumber - The number of the week to delete
 @param string - courseName - The name of the course to delete the week from
*/
async function deleteWeek(weekNumber, courseName) {
    const sql = await init();
    const query = sql.format(`delete from weeks where courseName = ? and weekNumber = ?`, [courseName, weekNumber]);
    try {
        await sql.query(query);
    } catch (e) {
        console.error("ERROR code : databaseMethods.js09 : error deleting week: " + e);
    }
}
module.exports.deleteWeek = deleteWeek;

/*
 This function (deleteCourse) should delete a given course from the database
 @param string - courseName - The name of the course to delete
 @param string - ownerEmail - The owner of the course to delete
*/
async function deleteCourse(courseName, ownerEmail) {
    const sql = await init();
    const query = sql.format(`delete from courses where courseName = ? and ownerEmail= ?`, [courseName, ownerEmail]);
    try {
        await sql.query(query);
    } catch (e) {
        console.error("ERROR code : databaseMethods.js10 : error deleting course: " + e);
    }
}
module.exports.deleteCourse = deleteCourse;

/*
 This function(transferOwnershipOfCourse) should change the owner email of a given course in the database.
 @param - String - courseName - The name of the course to change the owner of
 @param - String - ownerEmail - The current owner of the course
 @param - String - newOwner - The owner that the course will be transfered to
*/
async function transferOwnershipOfCourse(courseName,ownerEmail,newOwner) {
    console.log("transferOwnershp to "+newOwner);
    const sql = await init();
        const query = sql.format(`update courses set ownerEmail =? where courseName = ? and ownerEmail = ? `, [newOwner,courseName, ownerEmail]);
    try {
    await sql.query(query);
    } catch (e) {
            console.error("ERROR code : databaseMethods.js12 : error transferingOwnership : "+e)
    }
}
module.exports.transferOwnershipOfCourse = transferOwnershipOfCourse;

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

//Functions taken from sql-contact-list in examples week 11
//  https://github.com/portsoc/ws_sql/blob/master/examples/sql-contact-list.js

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
