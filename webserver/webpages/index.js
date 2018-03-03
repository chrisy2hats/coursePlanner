//Author up809059
//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('newWeekButton').addEventListener('click', addNewWeek);
document.getElementById('newTopicButton').addEventListener('click', addTextAreaToTopics);
document.getElementById('newNotesAndIdeasButton').addEventListener('click', addTextAreaToNotes);
document.getElementById('newResourceButton').addEventListener('click', addTextAreaToResources);
document.getElementById('logoutButton').addEventListener('click', signOut);
document.getElementById('saveButton').addEventListener('click', saveChanges);
document.getElementById('newCourseButton').addEventListener('click', addCourse); //TODO
document.getElementById('keyboardShortcutsButton').addEventListener('click', viewKeyboardShortcuts);
document.getElementById('coursesDropdown').addEventListener('change', courseSelected);




function viewKeyboardShortcuts() {
    console.log("View keyboard shortcuts called");
    alert("TODO");
}
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
async function switchToWeek(event, courseName, weekNumber) { //Run when a specific week is clicked on
    console.log("Switch to week called: " + weekNumber);
    console.log("Switch to week called: " + courseName);
    saveChanges(); //Causing changes to be saved if a different week is clicked on.
    //Clearing columns so previous weeks contents doesn't linger
    window.selectedWeek = weekNumber; //So saveChanges knows which week is selected
    document.querySelector('.topicsColumn').innerHTML = "Topics";
    document.querySelector('.notesColumn').innerHTML = "Notes and Ideas";
    document.querySelector('.resourcesColumn').innerHTML = "Resources text";
    //TODO
    const url = '/webserver/getWeek?courseName=' + courseName + '&weekNumber=' + weekNumber;
    const response = await fetch(url);
    console.log(courseName)
    if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse) {
            console.log(weekNumber);
            if (jsonResponse.topics) addTextAreaToTopics(null, jsonResponse.topics);
            if (jsonResponse.notesAndIdeas) addTextAreaToNotes(null, jsonResponse.notesAndIdeas);
            if (jsonResponse.resources) addTextAreaToResources(null, jsonResponse.resources);
        }
    }
}
/*
Get contents of text box and use their email as the owner
*/
async function addCourse() {
    console.log("addCourse called");
    let courseName = document.getElementById('newCourseTextField').value;
    if (courseName) {
        let email = window.userEmail;
        const url = '/webserver/addCourse?courseName=' + courseName + '&ownerEmail=' + email;
        let response = await fetch(url);
        if (response.ok) {
            console.log("ok response");
            console.log(response.statusCode);
            populateCoursesDropdown();
        }
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
        return numberOfWeeks;
    }
}


/*
TODO Explaination
*/ //TODO

async function saveChanges() {
    console.log("Save changes called");
    //TODO update database then inform user save was successful
    let weekNumber = window.selectedWeek; //TODO Change this.Global variables eww
    console.log("weekNumber in saveChanges"+weekNumber);

    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
    let    courseName = coursesDropdown.options[indexOfSelectCourse].text;
        let topics = document.getElementById('topicsColumnTextArea') ? document.getElementById('topicsColumnTextArea').value : "";
        let notesAndIdeas = document.getElementById('notesColumnTextArea') ? document.getElementById('notesColumnTextArea').value : "";
        let resources = document.getElementById('resourcesColumnTextArea') ? document.getElementById('resourcesColumnTextArea').value : "";
        const url = '/webserver/updateWeek?weekNumber=' + weekNumber + "&courseName=" + courseName + "&topics=" + topics + "&notesAndIdeas=" + notesAndIdeas + "&resources=" + resources;
        //TODO check for undefined variables before sending
        let response = await fetch(url);
        if (response.ok) {
            console.log("response OK" + response.textContent); //TODO bug this is undefined
        }
    }
}
/*
TODO Explaination
*/
async function courseSelected() {
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    let selectedCourse = coursesDropdown.options[indexOfSelectCourse].text;
    clearColumns();
    if (indexOfSelectCourse != 0) {; //Stops function if "Courses" is selected
        let numberOfWeeks = await getNumberOfWeeks(selectedCourse);
        for (let i = 0; i < numberOfWeeks; i++) addNewWeek(true); //true indicates it is loading weeks not creating weeks.
        if (numberOfWeeks > 0) switchToWeek(null, selectedCourse, 1); //If statement protects from trying to load week 1 for empty course.
    }
}


//Page interaction functions.(Run locally do not call the server.)
/*
  Works by some magic called JavaScript closure
 */
function bindToSwitchToWeek(weekNumber, courseName) { //https://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
    return function() {
        switchToWeek(null, courseName, weekNumber);
    };
}
/*
 This function (addNewWeek) should create a new box within the box labelled "Weeks". Each box should be "Week" followed by the week number.
 @params load boolean to indicate if the new week is being loaded or created for the first time. If it is being created it should be added to the database.
*/
async function addNewWeek(load) {
    console.log("add week called");
    let numberOfWeeks = document.querySelectorAll('#weeksColumnGrid').length + 1; //TODO make this accurate. If I have 10 weeks and I delete week 4 the next week will be week 10 not 11
    let weeksColumn = document.querySelector('.weeksColumn');
    let weeksColumnContents = weeksColumn.innerHTML;
    weeksColumn.innerHTML = weeksColumnContents + '<div id="weeksColumnGrid"  >Week ' + numberOfWeeks + '</div>'; //TODO make this less hard coded
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    let selectedCourse = coursesDropdown.options[indexOfSelectCourse].text;
    //Adding the newly created week to the database
    if (load != true) { //Cannot use "!load" as undefined would make the code run
        if (window.userEmail) { //Checking they are signed in
            //Adding new week to the database so the save button can run an update query on it
            if (indexOfSelectCourse != 0) {
                const url = '/webserver/addWeek/?weekNumber=' + numberOfWeeks + '&courseName=' + selectedCourse;
                let response = await fetch(url);
                if (response.ok) {
                    console.log("Response ok");
                    console.log(response.statusCode);
                }
            }
        }
    }
    for (let i = 0; i < weeksColumn.childNodes.length; i++)
        weeksColumn.childNodes[i].addEventListener('click', bindToSwitchToWeek(i, selectedCourse));
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
    // console.log("Cleared weeks column");""j
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
