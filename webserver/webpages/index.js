//Author up809059
//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('newWeekButton').addEventListener('click', addNewWeek);
document.getElementById('newTopicButton').addEventListener('click', addTextAreaToTopics);
document.getElementById('newNotesAndIdeasButton').addEventListener('click', addTextAreaToNotes);
document.getElementById('newResourceButton').addEventListener('click', addTextAreaToResources);
document.getElementById('logoutButton').addEventListener('click', signOut);
document.getElementById('saveButton').addEventListener('click', saveChanges);
document.getElementById('newCourseButton').addEventListener('click', addCourse);
document.getElementById('deleteWeekButton').addEventListener('click', deleteWeek);
document.getElementById('deleteCourseButton').addEventListener('click', deleteCourse);
document.getElementById('transferOwnershipButton').addEventListener('click', transferOwnershipOfCourse);
// document.getElementById('addCollaboratorButton').addEventListener('click', addCollaborator);
// document.getElementById('removeCollaboratorButton').addEventListener('click', removeCollaborator);
// document.getElementById('keyboardShortcutsButton').addEventListener('click', viewKeyboardShortcuts);
document.getElementById('coursesDropdown').addEventListener('change', courseSelected);
document.getElementById('coursesDropdown').addEventListener('click', saveChanges);
document.getElementById('coursesDropdown').addEventListener('click', saveChanges);

function getCurrentWeek() {
    let href = window.location.href;
    let url = new URL(href);
    let week = url.searchParams.get("currentWeek");
    return week;
}

function getCourseName() {
    let href = window.location.href;
    let url = new URL(href);
    let week = url.searchParams.get("courseName");
    return week;
}

function setCoursesDropdown(courseName) {
    console.log("setting to" + courseName);
    let coursesDropdown = document.getElementById('coursesDropdown');
    for (let i = 0; i < coursesDropdown.length; i++) {
        if (coursesDropdown.options[i].text == courseName) {
            coursesDropdown.selectedIndex = i;
            break;
        }
    }
}

function setUrlParams(weekNumber, courseName) {
    if (!weekNumber) weekNumber = getCurrentWeek();
    if (!courseName) courseName = getCourseName();
    history.pushState(null, null, `/?currentWeek=${weekNumber}&courseName=${courseName}`);
}

/*
Function kinda redundant as collaborators have the same access rights as owners atm
*/
async function transferOwnershipOfCourse() {
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let courseName = coursesDropdown.options[indexOfSelectCourse].text;
        let ownerEmail = window.userEmail;
        let newOwnerEmail = document.getElementById('newOwnerTextField').value;
        const url = '/webserver/transferOwnership?courseName=' + courseName + '&ownerEmail=' + ownerEmail + '&newOwnerEmail=' + newOwnerEmail;
        let response = await fetch(url);
        if (response.ok) {}
    }
}


//TODO remove the delted week from the List of weeks
async function deleteWeek() {
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let weekNumber = window.selectedWeek
        let courseName = coursesDropdown.options[indexOfSelectCourse].text;
        const url = '/webserver/deleteWeek?weekNumber=' + weekNumber + "&courseName=" + courseName
        let response = await fetch(url);
        if (!response.ok) console.error("ERROR error delete week: ");
    }
}

//TODO clear the screen of remnants of the course
async function deleteCourse() {
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let ownerEmail = window.userEmail;
        let courseName = coursesDropdown.options[indexOfSelectCourse].text;
        const url = '/webserver/deleteCourse?courseName=' + courseName + '&ownerEmail=' + ownerEmail;
        let response = await fetch(url);
        if (response.ok) {
            //TODO
        }
    }
}

function addCollaborator() {
    console.log("addCollaborator called");
}


function viewKeyboardShortcuts() {
    console.log("View keyboard shortcuts called");
}

//Functions that call the web server
/*
 This function (populateCoursesDropdown) should retrieve all courses associated with the signed in users
 and put these courses into a dropdown list. The courses should only be loaded if a user is signed in.
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
 This function (switchToWeek) should be called when a user clicks on a week within the weeks column. It should load the week from the database and populate the columns. Before the database is retrieved changes made on the currently selected week should be saved. //TODO poorly written sentence
 @params event  The event that has triggered the function to be called.This is usually a mouse click. This parameter should be disregarded.It automatically fills the first parameter when triggered from event listeners
 @params courseName the name of the course to save the database under.
 @params weekNumber the number of the week being switched to.
 TODO Not use global to remember selected week
*/
async function switchToWeek() {
    // switchToWeek
    // saveChanges(); //Saving changes to currently selected week
    let courseName = getCourseName();
    let weekNumber = getCurrentWeek();
    clearColumns(false, true, true, true); //Clear all columns but the weeks column.Stops previous weeks contents lingerring

    let weeksColumn = document.querySelector('.weeksColumn');
    let previousSelectedWeek = document.querySelector(".selected");
    if (previousSelectedWeek) previousSelectedWeek.classList.toggle("selected"); //A previous week may not be selected if an empty course is chosen

    if (weeksColumn.childNodes[weekNumber])
        weeksColumn.childNodes[weekNumber].classList.toggle("selected");

    const url = '/webserver/getWeek?courseName=' + courseName + '&weekNumber=' + weekNumber;
    const response = await fetch(url);
    console.log("loading"+weekNumber +"of"+courseName);
    if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse) {

            if (jsonResponse.topics) addTextAreaToTopics(null, jsonResponse.topics);
            if (jsonResponse.notesAndIdeas) addTextAreaToNotes(null, jsonResponse.notesAndIdeas);
            if (jsonResponse.resources) addTextAreaToResources(null, jsonResponse.resources);
        }
    } else {
        console.error("ERROR switching to week:" + weekNumber + " course: " + courseName);
    }
}

/*
Get contents of text box and use their email as the owner
TODO explanation
*/
async function addCourse() {
    let courseName = document.getElementById('newCourseTextField').value;
    if (courseName) {
        let email = window.userEmail;
        const url = '/webserver/addCourse?courseName=' + courseName + '&ownerEmail=' + email;
        let response = await fetch(url);
        if (response.ok) {
            populateCoursesDropdown();
        }
        await addNewWeek();
        setUrlParams(1,courseName);
        await switchToWeek();
        setCoursesDropdown(courseName);
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
*/
function nodeListToJSON(nodeList) {
    let array = [];
    nodeList.forEach(element => {
        if (element.value != "" && element.value != null) { //Stops blank text areas being saved
            array.push(element.value);
        }
    });
    if (array.length != 0) {
        return JSON.stringify(array);
    } else {
        return undefined;
    }
}

/*
TODO Explaination
*/
async function saveChanges() {
    //TODO update database then inform user save was successful
    let weekNumber = getCurrentWeek();
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let topicsTextAreas = document.querySelectorAll('#topicsColumnTextArea');
        let notesTextAreas = document.querySelectorAll('#notesColumnTextArea');
        let resourcesTextAreas = document.querySelectorAll('#resourcesColumnTextArea');
        let arrayOfTopicsText = nodeListToJSON(topicsTextAreas);
        console.log("saving topics contents as :"+arrayOfTopicsText);
        let arrayOfNotesText = nodeListToJSON(notesTextAreas);
        let arrayOfResourcesText = nodeListToJSON(resourcesTextAreas);
        let courseName = getCourseName();

        console.log("Saving changes to:"+courseName+"week:"+weekNumber);
        const url = '/webserver/updateWeek?weekNumber=' + weekNumber + "&courseName=" + courseName + "&topics=" + arrayOfTopicsText + "&notesAndIdeas=" + arrayOfNotesText + "&resources=" + arrayOfResourcesText;

        let response = await fetch(url);
        if (response.ok) {}
    }
}

/*
TODO Explaination
*/
async function courseSelected() {
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    let selectedCourse = coursesDropdown.options[indexOfSelectCourse].text;
    await saveChanges();
    setUrlParams(1,selectedCourse);
    console.log("changingToCourse"+selectedCourse);
    // saveChanges();
    clearColumns(true, true, true, true);
    if (indexOfSelectCourse != 0) {; //Stops function if "Courses" is selected
        //TODO set save button to allowed using cursor: allowed;
        let numberOfWeeks = await getNumberOfWeeks(selectedCourse);
        for (let i = 0; i < numberOfWeeks; i++) addNewWeek(true); //true indicates it is loading weeks not creating weeks.
        if (numberOfWeeks > 0) switchToWeek(null, selectedCourse, 1); //If statement protects from trying to load week 1 for empty course.
    } else {
        //TODO set save button to not allowed using cursor: not-allowed;
    }
}


/*
  Works by some magic called JavaScript closure
 */
function bindToSwitchToWeek(weekNumber, courseName) { //https://stackoverflow.com/questions/17981437/how-to-add-event-listeners-to-an-array-of-objects
    return function() {
        saveChanges();
        clearColumns(false,true,true,true);
        setUrlParams(weekNumber, courseName);
        switchToWeek(null, courseName, weekNumber);

    };
}
/*
 This function (addNewWeek) should create a new box within the box labelled "Weeks". Each box should be "Week" followed by the week number.
 @params load boolean to indicate if the new week is being loaded or created for the first time. If it is being created it should be added to the database.
*/
async function addNewWeek(load) {
    let numberOfWeeks = document.querySelectorAll('#weeksColumnGrid').length + 1; //TODO make this accurate. If I have 10 weeks and I delete week 4 the next week will be week 10 not 11. Could use a regex search for numbers on the last child element on the column.
    let weeksColumn = document.querySelector('.weeksColumn');
    let weeksColumnContents = weeksColumn.innerHTML;
    weeksColumn.innerHTML = weeksColumnContents + '<div id="weeksColumnGrid"  >Week ' + numberOfWeeks + '</div>';
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
                    //TODO something  here
                }
            }
        }
    }
    for (let i = 0; i < weeksColumn.childNodes.length; i++) //TODO try to use a map here
        weeksColumn.childNodes[i].addEventListener('click', bindToSwitchToWeek(i, selectedCourse));
}

/*
 This function (addTextAreaToTopics) should create a new text area within the box labelled "Topics".
*/
function addTextAreaToTopics(event, contents) {
    let topicsColumn = document.querySelector('.topicsColumn');
    try {
        contents = JSON.parse(contents) //Will fail if contents is undefined
        contents.map(element => {
            topicsColumn.innerHTML += '<textarea id="topicsColumnTextArea"  placeholder="Enter Text">' + element + '</textarea>'
        });
    } catch (e) {
        topicsColumn.innerHTML += '<textarea id="topicsColumnTextArea"  placeholder="Enter Text"></textarea>'
    }
}

/*
 This function (addTextAreaToNotes) should create a new text area within the box labelled "Notes and ideas".
*/
function addTextAreaToNotes(event, contents) {
    let notesColumn = document.querySelector('.notesColumn');
    try {
        contents = JSON.parse(contents) //Will fail if contents is undefined
        contents.map(element => {
            notesColumn.innerHTML += '<textarea id="notesColumnTextArea"  placeholder="Enter Text">' + element + '</textarea>'
        });
    } catch (e) {
        notesColumn.innerHTML += '<textarea id="notesColumnTextArea"  placeholder="Enter Text"></textarea>'
    }
}


/*
 This function (addTextAreaToResources) should create a new text area within the box labelled "Resources text".
*/
function addTextAreaToResources(event, contents) {
    let resourcesColumn = document.querySelector('.resourcesColumn');
    try {
        contents = JSON.parse(contents) //Will fail if contents is undefined
        contents.map(element => {
            resourcesColumn.innerHTML += '<textarea id="resourcesColumnTextArea"  placeholder="Enter Text">' + element + '</textarea>'
        });
    } catch (e) {
        resourcesColumn.innerHTML += '<textarea id="resourcesColumnTextArea"  placeholder="Enter Text"></textarea>'
    }
}


/*
TODO Explaination
Got to clear all 4 columns
*/
function clearColumns(weeks, topics, notes, resources) {
    if (weeks) document.querySelector('.weeksColumn').innerHTML = "Weeks";
    if (topics) document.querySelector('.topicsColumn').innerHTML = "Topics";
    if (notes) document.querySelector('.notesColumn').innerHTML = "Notes and Ideas";
    if (resources) document.querySelector('.resourcesColumn').innerHTML = "Resources text";
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
        clearColumns(true, true, true, true);
        document.querySelector('#coursesDropdown').innerHTML = '<option value = "0">Courses</option>>';
        document.getElementById('logoutButton').style.visibility = "hidden";
        document.getElementById('saveButton').style.visibility = "hidden";
        console.log('User signed out.');
    });
}

async function callServer() {
    const id_token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

    const fetchOptions = {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + id_token
        },
    };
    const response = await fetch('/api/hello', fetchOptions);
    if (!response.ok) {
        // handle the error
        return;
    }
    // handle the response
}

(function() {
    const CHECK_DELAY = 2000;
    let lastTime = Date.now();

    setInterval(() => {
        const currentTime = Date.now();
        if (currentTime > (lastTime + CHECK_DELAY * 2)) { // ignore small delays
            gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
        }
        lastTime = currentTime;
    }, CHECK_DELAY);
}());
