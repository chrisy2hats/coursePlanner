const GoogleAuth = require('simple-google-openid');
const express = require('express');
const app = express();
const databaseMethod = require('../database/databaseMethods.js');

let googleClientID = "424667604152-rh5b1c1fb52tqgqnf9lmau2vi826fa8i.apps.googleusercontent.com";
app.use(GoogleAuth(googleClientID));
app.use('/api', GoogleAuth.guardMiddleware());
app.get('/api/hello', outputUserInfo);

function outputUserInfo(req, res) {
    try {
        console.log(req.user.displayName);
        console.log(req.user.emails[0].value);
        console.log("id" + req.user.id);
        res.send(req.user.displayName);
    } catch (e) {
        console.error("ERROR code : server.js04 : error getting user info: " + e);
    }
}

//Serving of static pages.
app.use('/', express.static('webpages', {
    extensions: ['html']
}));

//Client to database middleware
/*
 This function (/webserver/getCourses) should go retrieve the names of all courses associated with an email via the database methods.
 It should check that one to many courses are returned and not run a query if the email address passed is undefined.
 @return {JSON Object} Containing an array of the course names.
*/
app.get('/webserver/getCourses/', async function(req, res) { //TODO getCourses is probably not the best name
    let email = req.user.emails[0].value;
    if (!email) {
        res.statusCode = 500;
        console.error("ERROR code: server.js03 : undefined passed to getCourses");
        res.send({});
    } else {
        let courses = await databaseMethod.retrieveCoursesByEmail(email);
        if (courses.length == 0) {
            // res.statusCode = 500;
            console.error("ERROR code: server.js02 : 0 line response for email: " + email);
            res.send("You have no courses");
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.json(courses);
        }
    }
});

app.get('/webserver/transferOwnership', async function(req, res) {
    res.statusCode = 200;
    let courseName = req.query.courseName;
    let ownerEmail = req.user.emails[0].value;
    let newOwnerEmail = req.query.newOwnerEmail;
    console.log(`Transfering course: ${courseName} from ${ownerEmail} to ${newOwnerEmail}`);
    await databaseMethod.transferOwnershipOfCourse(courseName, ownerEmail, newOwnerEmail);

});


app.get('/webserver/deleteCourse', async function(req, res) {
    console.log("delete cours called");
    res.statusCode = 200;
    let courseName = req.query.courseName;
    let ownerEmail = req.query.ownerEmail;
    try {
        let query = await databaseMethod.deleteCourse(courseName, ownerEmail);
    } catch (e) {
        console.error("ERROR code : server.js14 : error deleting course:" + e);
        res.statusCode = 500;
    }
    res.send()
});

app.get('/webserver/deleteWeek', async function(req, res) {
    res.statusCode = 200;
    let weekNumber = req.query.weekNumber;
    let courseName = req.query.courseName;
    try {
        let query = await databaseMethod.deleteWeek(weekNumber, courseName);
    } catch (e) {
        console.error("ERROR code : server.js13 : error deleting week:" + e);
        res.statusCode = 500;
    }
    res.send()
});

app.get('/webserver/addCourse', async function(req, res) {
    res.statusCode = 200;
    let courseName = req.query.courseName;
    let ownerEmail = req.user.emails[0].value;
    try {
        let queryResponse = await databaseMethod.addCourse(courseName, ownerEmail);
    } catch (e) {
        console.error("ERROR code : server.js05 : Error adding course: " + course + " with owner: " + ownerEmail);
        res.statusCode = 500;
    }
    res.send();
});

app.post('/webserver/addWeek', async function(req, res) {
    console.log("addWeek called");
    res.statusCode = 200;
    let weekNumber = req.query.weekNumber;
    let courseName = req.query.courseName;
    try {
        let queryResponse = await databaseMethod.addWeek(weekNumber, courseName)
    } catch (e) {
        console.error("ERROR code : server.js06 : Error whilst adding week:" + e);
        res.statusCode = 500;
    }
    res.send();
});


app.get('/webserver/updateWeek', async function(req, res) {
    res.setHeader('Content-Type', 'text/text');
    console.log("updateWeek");

    res.statusCode = 200;
    let weekNumber = req.query.weekNumber;
    console.log(weekNumber);
    let courseName = req.query.courseName;
    let topics = req.query.topics;
    console.log(topics);
    let notesAndIdeas = req.query.notesAndIdeas;
    let resources = req.query.resources;
    try {
        let weekContents = await databaseMethod.updateWeek(weekNumber, courseName, topics, notesAndIdeas, resources);
    } catch (e) {
        console.error("ERROR code : server.js05 : error updating week: " + weekNumber + " in course: " + courseName);
        res.statusCode = 500;
    }
    res.textContent = "YOOOOOOOOOOOo"; //TODO bug this isn't being sent
    res.send();
});


app.get('/webserver/getWeek', async function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    let weekNumber = req.query.weekNumber;
    let courseName = req.query.courseName;
    let weekContents = [];
    try {
        weekContents = await databaseMethod.getWeek(courseName, weekNumber);
    } catch (e) {
        console.error("ERROR code : server.js07 : error in get week: " + e);
        res.statusCode = 500;
    }
    res.json(weekContents[0]);
});


app.get('/webserver/getNumberOfWeeks/', async function(req, res) { //TODO getCourses is probably not the best name
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    let courseName = req.query.courseName;
    let courseInfo = [];
    try {
        courseInfo = await databaseMethod.getNumberOfWeeksInACourse(courseName);

    } catch (e) {
        console.error("ERROR code : server.js08 : error whilst getting number of weeks: " + e);
        res.statusCode = 500;
    }
    res.json(courseInfo[0]);
});


/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080;
app.listen(port, (err) => {
    if (err) console.error('ERROR code: server.js01 : Cannot start server: ', err);
    else console.log('Course Planner server now running.');
});
