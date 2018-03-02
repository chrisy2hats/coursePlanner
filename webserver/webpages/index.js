console.log("index.js called." + Math.floor(Math.random() * 20)); //Non static message to check page is reloaded.

//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('newWeekButton').addEventListener('click', addNewWeek);
document.getElementById('logoutButton').addEventListener('click', signOut);
document.getElementById('newTopicButton').addEventListener('click', addTextAreaToTopics);
document.getElementById('newNotesAndIdeasButton').addEventListener('click', addTextAreaToNotes);
document.getElementById('newResourceButton').addEventListener('click', addTextAreaToResources);

/*
 This function (populateCoursesDropdown) should retrieve all courses associated with the signed in users
 and put these courses into a dropdown list. The courses should only be loaded if a user is signed in.
 TODO fix bug. List fills with "undefined" if I drop the database.
*/
async function populateCoursesDropdown() {
    let email = window.userEmail;
    const url = '/webserver/getCourses?email=' + email;
    const response = await fetch(url);
    if (response.ok) {
        let jsonResponse = await response.json();
        let dropDownList = document.querySelector('#coursesDropdown');
        dropDownList.innerHTML = '<option value = "0">Courses</option>>'; //Stops pressing the sign in button multiple times duplicating dropdown
        for (course in jsonResponse) {
            dropDownList.innerHTML = dropDownList.innerHTML + '<option value=' + course + '>' + jsonResponse[course].courseName + '</option';
        }
    } else {
        console.error("ERROR code : populateCoursesDropdown01 : Invalid response from server");
    }

}


/*
 This function (addNewWeek) should create a new box within the box labelled "Weeks". Each box should be "Week" followed by the week number.
*/
function addNewWeek() {
    let numberOfWeeks = document.querySelectorAll('#weeksColumnGrid').length + 1;
    let weeksColumn = document.querySelector('.weeksColumn');
    let weeksColumnContents = weeksColumn.innerHTML;
    weeksColumn.innerHTML = weeksColumnContents + '<div id="weeksColumnGrid" draggable="true" >Week ' + numberOfWeeks + '</div>'; //TODO make this less hard coded
}

/*
 This function (addTextAreaToTopics) should create a new text area within the box labelled "Topics".
*/
function addTextAreaToTopics() {
    let topicsColumn = document.querySelector('.topicsColumn');
    let topicsColumnContents = topicsColumn.innerHTML;
    topicsColumn.innerHTML = topicsColumnContents + '<textarea id="topicsColumnTextArea"  placeholder="asdasdasd">asdasd</textarea>'
}

/*
 This function (addTextAreaToNotes) should create a new text area within the box labelled "Notes and ideas".
*/
function addTextAreaToNotes() {
    let notesColumn = document.querySelector('.notesColumn');
    let notesColumnContents = notesColumn.innerHTML;
    notesColumn.innerHTML = notesColumnContents + '<textarea id="notesColumnTextArea"  placeholder="asdasdasd">asdasd</textarea>'
}

/*
 This function (addTextAreaToResources) should create a new text area within the box labelled "Resources text".
*/
function addTextAreaToResources() {
    let resourcesColumn = document.querySelector('.resourcesColumn');
    let resourcesColumnContents = resourcesColumn.innerHTML;
    resourcesColumn.innerHTML = resourcesColumnContents + '<textarea id="resourcesColumnTextArea"  placeholder="asdasdasd">asdasd</textarea>'
}

//Below 2 functions are from Google - https://developers.google.com/identity/sign-in/web/sign-in
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
    populateCoursesDropdown();
}

/*
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
function signOut() {
    window.userEmail = undefined;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        document.querySelector('#coursesDropdown').innerHTML = '<option value = "0">Courses</option>>';
        console.log("Drop down list of courses emptied");
        console.log('User signed out.');
    });
}
