const express = require('express');
const app = express();
const databaseMethod = require('../database/databaseMethods.js');

//Serving of static pages.
app.use('/', express.static('webpages', { //TODO this doesn't work if node is called from a different directory
    extensions: ['html']
}));

//Client to database middleware
/*
 This function (/webserver/getCourses) should go retrieve the names of all courses associated with an email via the database methods.
 It should check that one to many courses are returned and not run a query if the email address passed is undefined.
 @return {JSON Object} Containing an array of the course names.
*/
app.get('/webserver/getCourses/', async function(req, res) { //TODO getCourses is probably not the best name
    res.setHeader('Content-Type', 'application/json');
    let email = req.query.email;
    if (!email) {
        res.statusCode = 500;
        console.error("ERROR code: server.js03 : undefined passed to getCourses");
        res.json({
            error: "ERROR code: server.js03 : undefined passed to getCourses"
        });
    }
    let courses = await databaseMethod.retrieveCoursesByEmail(email);
    if (courses.length == 0) {
        res.statusCode = 500;
        console.error("ERROR code: server.js02 : 0 line response for email: " + email);
        res.json({
            error: "ERROR code: server.js02 : 0 line response for email:"
        });
    }
    res.statusCode = 200;
    res.json(courses);
});


app.get('/webserver/addCourse', async function(req, res) {
    res.statusCode = 200;
    let courseName = req.query.courseName;
    let ownerEmail = req.query.ownerEmail;
    try {
        let queryResponse = await databaseMethod.addCourse(courseName, ownerEmail);
    } catch (e) {
        console.error("ERROR code : server.js05 : Error adding course: " + course + " with owner: " + ownerEmail);
        res.statusCode = 500;
    }
    res.send();
});

app.get('/webserver/addWeek', async function(req, res) {
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
    res.statusCode = 200;
    let weekNumber = req.query.weekNumber;
    let courseName = req.query.courseName;
    let topics = req.query.topics;
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
    let weekNumber = req.query.weekNumber;
    let courseName = req.query.courseName;
    let weekContents = await databaseMethod.getWeek(courseName, weekNumber);
    res.json(weekContents[0]);
});


app.get('/webserver/getNumberOfWeeks/', async function(req, res) { //TODO getCourses is probably not the best name
    res.setHeader('Content-Type', 'application/json');
    let courseName = req.query.courseName;
    let courseInfo = await databaseMethod.getNumberOfWeeksInACourse(courseName);
    res.json(courseInfo[0]);
});


/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080;
app.listen(port, (err) => {
    if (err) console.error('ERROR code: server.js01 : Cannot start server: ', err);
    else console.log('Course Planner server now running.');
});
