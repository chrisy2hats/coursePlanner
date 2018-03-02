//Author up809059
//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('newWeekButton').addEventListener('click', addNewWeek);
document.getElementById('newTopicButton').addEventListener('click', addTextAreaToTopics);
document.getElementById('newNotesAndIdeasButton').addEventListener('click', addTextAreaToNotes);
document.getElementById('newResourceButton').addEventListener('click', addTextAreaToResources);
document.getElementById('logoutButton').addEventListener('click', signOut);
document.getElementById('saveButton').addEventListener('click', saveChanges);
document.getElementById('coursesDropdown').addEventListener('change', courseSelected);

//Functions that call the web server
/*
 This function (populateCoursesDropdown) should retrieve all courses associated with the signed in users
 and put these courses into a dropdown list. The courses should only be loaded if a user is signed in.
 TODO bug. List fills with "undefined" if I drop the database.
*/
async function populateCoursesDropdown() {
    let email = window.userEmail;
    const url = '/webserver/getCourses?email=' + email;
    const response = await fetch(url);
    if (response.ok) {
        let jsonResponse = await response.json();
        let dropDownList = document.querySelector('#coursesDropdown');
        dropDownList.innerHTML = '<option value = "0">Courses</option>>'; //Stops pressing the sign in button multiple times duplicating dropdown TODO bug if an empty courses is selected and then user loggs out there is "Courses" as an option
        for (course in jsonResponse) {
            dropDownList.innerHTML = dropDownList.innerHTML + '<option value=' + course + '>' + jsonResponse[course].courseName + '</option';
        }
    } else {
        console.error("ERROR code : populateCoursesDropdown01 : Invalid response from server");
    }
}

/*
TODO Explaination
Needs to save changes before changing weeks.
*/
async function switchToWeek(event, courseName, numberOfWeeks) { //Run when a specific week is clicked on
    console.log("Switch to week called: " + numberOfWeeks);
    //TODO
    courseName = "WEBF1";
    weekNumber = 1;
    // if (weeks[week].topics) addTextAreaToTopics(null, weeks[week].topics);
    // if (weeks[week].notesAndIdeas) addTextAreaToNotes(null, weeks[week].notesAndIdeas);
    // if (weeks[week].resources) addTextAreaToResources(null, weeks[week].resources);
    const url = '/webserver/getWeek?courseName=' + courseName + '&weekNumber=' + weekNumber;
    const response = await fetch(url);
    if (response.ok) {
        let jsonResponse = await response.json();
        addTextAreaToTopics(null, jsonResponse.topics);
        addTextAreaToNotes(null, jsonResponse.notesAndIdeas);
        addTextAreaToResources(null, jsonResponse.resources);
    }
}

/*
TODO Explaination
Needs to load the number of weeks and the contents for the first week.
*/
async function getNumberOfWeeks(courseName) {
    const url = '/webserver/getNumberOfWeeks?courseName=' + courseName;
    let response = await fetch(url);
    if (response.ok) {
        let jsonResponse = await response.json();
        let numberOfWeeks = jsonResponse[0].numOfWeeks;
        //TODO change to a for in loop
        for (let i = 0; i < numberOfWeeks; i++) addNewWeek();
    }
}


/*
TODO Explaination
*/
async function saveChanges() {
    console.log("Save changes called");
    console.log("WARNING. SAVE DOES NOTING AT THE MOMENT");
    //TODO update database then inform user save was successful
}

/*
TODO Explaination
*/
async function courseSelected() {
    let coursesDropdown = document.getElementById('coursesDropdown');
    let selectedCourse = coursesDropdown.options[coursesDropdown.selectedIndex].text;
    clearColumns();
    getNumberOfWeeks(selectedCourse);
    switchToWeek(null, selectedCourse, 1);
}


//Page interaction functions.(Run locally do not call the server.)
/*
 This function (addNewWeek) should create a new box within the box labelled "Weeks". Each box should be "Week" followed by the week number.
*/
function addNewWeek() {
    let numberOfWeeks = document.querySelectorAll('#weeksColumnGrid').length + 1;
    let weeksColumn = document.querySelector('.weeksColumn');
    let weeksColumnContents = weeksColumn.innerHTML;
    weeksColumn.innerHTML = weeksColumnContents + '<div id="weeksColumnGrid" draggable="true" >Week ' + numberOfWeeks + '</div>'; //TODO make this less hard coded
    // let latestWeek = weeksColumn.childNodes[numberOfWeeks];
    //TODO add event listener
}

/*
 This function (addTextAreaToTopics) should create a new text area within the box labelled "Topics".
*/
function addTextAreaToTopics(event, contents) {
    if (!contents) contents = ""; //Stops undefined being up in the box.
    let topicsColumn = document.querySelector('.topicsColumn');
    let topicsColumnContents = topicsColumn.innerHTML;
    topicsColumn.innerHTML = topicsColumnContents + '<textarea id="topicsColumnTextArea"  placeholder="Enter Text">' + contents + '</textarea>'
}

/*
 This function (addTextAreaToNotes) should create a new text area within the box labelled "Notes and ideas".
*/
function addTextAreaToNotes(event, contents) {
    if (!contents) contents = ""; //Stops undefined being up in the box.
    let notesColumn = document.querySelector('.notesColumn');
    let notesColumnContents = notesColumn.innerHTML;
    notesColumn.innerHTML = notesColumnContents + '<textarea id="notesColumnTextArea"  placeholder="Enter Text">' + contents + '</textarea>'
}

/*
 This function (addTextAreaToResources) should create a new text area within the box labelled "Resources text".
*/
function addTextAreaToResources(event, contents) {
    if (!contents) contents = ""; //Stops undefined being up in the box.
    let resourcesColumn = document.querySelector('.resourcesColumn');
    let resourcesColumnContents = resourcesColumn.innerHTML;
    resourcesColumn.innerHTML = resourcesColumnContents + '<textarea id="resourcesColumnTextArea"  placeholder="Enter Text">' + contents + '</textarea>'
}


/*
TODO Explaination
Got to clear all 4 columns
*/
function clearColumns() {
    document.querySelector('.weeksColumn').innerHTML = "Weeks";
    // console.log("Cleared weeks column");
    document.querySelector('.topicsColumn').innerHTML = "Topics";
    // console.log("Cleared topics Column");
    document.querySelector('.notesColumn').innerHTML = "Notes and Ideas";
    // console.log("Cleared Notes and Ideas column");
    document.querySelector('.resourcesColumn').innerHTML = "Resources text";
    // console.log("Cleared Resources text");
}


//Google Functions. From : https://developers.google.com/identity/sign-in/web/sign-in
/*
 This function (onSignIn) is run whenever a google user presses the signin button and correctly authenticates OR whenever a signed in user loads the page. The function should set a global variable so other functions can check if a user is signed in. The function also logs the users information.
 @params googleUser The Google account being user. This is passed to the function by the Google API
*/
function onSignIn(googleUser) {
    //TODO wrap code in try catch incase cookie policy causes issues
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    window.userEmail = googleUser.getBasicProfile().getEmail();
    document.getElementById('logoutButton').style.visibility = "visible";
    document.getElementById('saveButton').style.visibility = "visible";
    populateCoursesDropdown();
}

/*
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
function signOut() {
    window.userEmail = undefined;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        clearColumns();
        document.querySelector('#coursesDropdown').innerHTML = '<option value = "0">Courses</option>>';
        console.log("Drop down list of courses emptied");
        document.getElementById('logoutButton').style.visibility = "hidden";
        console.log("Making logout button invisible");
        document.getElementById('saveButton').style.visibility = "hidden";
        console.log("Making Save button invisible");
        console.log('User signed out.');
    });
}
