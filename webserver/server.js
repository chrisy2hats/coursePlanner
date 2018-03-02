const express = require('express');
const app = express();
const databaseMethod = require('../database/databaseMethods.js');

app.use('/', express.static('webpages', { //TODO this doesn't work if node is called from a different directory
    extensions: ['html']
}));

/*
 This function (/webserver/getCourses) should go retrieve the names of all courses associated with an email via the database methods.
 It should check that one to many courses are returned and not run a query if the email address passed is undefined.
 @return {JSON Object} Containing an array of the course names.
*/
app.get('/webserver/getCourses/', async function(req, res) { //TODO getCourses is probably not the best name
    res.setHeader('Content-Type', 'application/json');
    let email = req.query.email;
    if (!email){
        res.statusCode=500;
        console.error("ERROR code: server.js03 : undefined passed to getCourses");
        res.json({error: "ERROR code: server.js03 : undefined passed to getCourses"});
    }
    let courses = await databaseMethod.retrieveCoursesByEmail(email);
    if (courses.length ==0){
        res.statusCode=500;
        console.error("ERROR code: server.js02 : 0 line response for email: "+email);
        res.json({error: "ERROR code: server.js02 : 0 line response for email:"});
    }
    res.statusCode=200;
    res.json(courses);
});


/* Code to run the server. This will run indefinetly unless terminated. If an error occurs during startup then this error should be outputted.Otherwise a successful startup should be indicated.The server is run on port 8080 by default. To change this edit the value of the port constant*/
const port = 8080;
app.listen(port, (err) => {
    if (err) console.error('ERROR code: server.js01 : Cannot start server: ', err);
    else console.log('Course Planner server now running.');
});
