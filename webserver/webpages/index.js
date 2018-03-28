'use strict'
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
document.getElementById('coursesDropdown').addEventListener('change', courseSelected);
document.getElementById('coursesDropdown').addEventListener('click', saveChanges);
document.getElementById('themeChanger').addEventListener("click", toggleTheme);
document.getElementById('fontSizeDropdown').addEventListener("change", setGlobalFontSize);
document.getElementById("optionsButton").addEventListener("click", toggleNavBar);

function toggleNavBar() {
    let navBar = document.getElementById("navBar");
    let currentWidth = navBar.style.width;
    currentWidth == "0em" ? navBar.style.width = "15em" : navBar.style.width = "0em";
}

//Making pressing enter in a text field call it's associated function
document.getElementById("newCourseTextField").onkeypress = (e) => {
    if (e.keyCode == '13') addCourse(); //keyCode 13 == enter
}

document.getElementById("newOwnerTextField").onkeypress = (e) => {
    if (e.keyCode == '13') transferOwnershipOfCourse();
}

//Making columns dropable
document.querySelector(".resourcesColumn").addEventListener("dragover", (e) => {
    e.preventDefault();
});


function setGlobalFontSize() {
    let fontSizeDropdown = document.getElementById("fontSizeDropdown");
    let size = fontSizeDropdown.options[fontSizeDropdown.selectedIndex].text;
    switch (size) { //"Small","Medium" and "Large" do not need to change as fontSize is not case sensitive
        case "Extra extra small":
            size = "xx-small";
            break;
        case "Extra small":
            size = "x-small";
            break;
        case "Extra large":
            size = "x-large";
            break;
        case "Extra extra large":
            size = "xx-large";
            break;
    }
    document.querySelectorAll('*').forEach(element => {
        element.style.fontSize = size;
    });
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function reportError(errorMessage, displayDuration) {
    if (!displayDuration) displayDuration = 1000;
    let errorReportSpace = document.getElementById("errorReporter");
    errorReportSpace.textContent = errorMessage;
    errorReportSpace.style.visibility = "visible";
    setTimeout(function() {
        errorReportSpace.style.visibility = "hidden";
        errorReportSpace.textContent = "Placeholder text"// Stops invisbile text taking up lots of space it a long error message is reported
    }, displayDuration);
}

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

function setUrlParams(weekNumber, courseName) {
    if (!weekNumber) weekNumber = getCurrentWeek();
    if (!courseName) courseName = getCourseName();
    history.pushState(null, null, `/?currentWeek=${weekNumber}&courseName=${courseName}`); //Sets the URL of the page without a reload.
}

function setCoursesDropdown(courseName) {
    let coursesDropdown = document.getElementById('coursesDropdown');
    for (let i = 0; i < coursesDropdown.length; i++) {
        if (coursesDropdown.options[i].text == courseName) {
            coursesDropdown.selectedIndex = i;
            break;
        }
    }
}

function toggleTheme() {
    //TODO make changes to theme presist over reloads by setting it as a url parameter
    let columnTitles = document.querySelectorAll("#columnTitle");
    console.log(columnTitles);
    let button = document.getElementById('themeChanger');
    let backgroundColor = document.body.style.backgroundColor;
    if (backgroundColor == "black") {
        document.body.style.backgroundColor = "#F8F9F9";
        button.textContent = "Join the dark side!";
        columnTitles.forEach(x => {
            x.style.color = "black";
        });
    } else {
        document.body.style.backgroundColor = "black";
        button.textContent = "Join the rebel alliance!";
        columnTitles.forEach(x => {
            x.style.color = "white";
        });
    }
}


/*
Function kinda redundant as collaborators have the same access rights as owners atm
*/
async function transferOwnershipOfCourse() {
    saveChanges();
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is then passed to the server.
        const fetchOptions = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        let courseName = coursesDropdown.options[indexOfSelectCourse].text;
        let newOwnerEmail = document.getElementById('newOwnerTextField').value;
        const url = `/webserver/transferOwnership?courseName=${courseName}&newOwnerEmail=${newOwnerEmail}&token=${token}`;
        let response = await fetch(url, fetchOptions);
        if (response.ok) {}
    }
}


//TODO remove the delted week from the List of weeks
async function deleteWeek() {
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let weekNumber = getCurrentWeek();
        let courseName = coursesDropdown.options[indexOfSelectCourse].text;
        const url = `/webserver/deleteWeek?weekNumber=${weekNumber}&courseName=${courseName}`;
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
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is then passed to the server.
        if (token) {
            const fetchOptions = {
                credentials: 'same-origin',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            };
            let courseName = coursesDropdown.options[indexOfSelectCourse].text;
            const url = `/webserver/deleteCourse?courseName=${courseName}&token=${token}`;
            let response = await fetch(url, fetchOptions);
        }
    }
}

//Functions that call the web server
/*
 This function (populateCoursesDropdown) should retrieve all courses associated with the signed in users
 and put these courses into a dropdown list. The courses should only be loaded if a user is signed in.
*/
async function populateCoursesDropdown() {
    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is then passed to the server.
    if (token) {
        const fetchOptions = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        let url = `/webserver/getCourses?token=${token}`

        const response = await fetch(url, fetchOptions);
        if (response.ok) {
            let jsonResponse = await response.json();
            let dropDownList = document.querySelector('#coursesDropdown');
            dropDownList.innerHTML = '<option value = "0">Courses</option>>'; //Stops pressing the sign in button multiple times duplicating dropdown TODO bug if an empty courses is selected and then user loggs out there is "Courses" as an option
            for (let course in jsonResponse) {
                dropDownList.innerHTML = dropDownList.innerHTML + `<option value="${course}">${jsonResponse[course].courseName}</option`;
            }
        } else {
            console.error("ERROR code : populateCoursesDropdown01 : Invalid response from server");
        }
    } else {
        console.error("ERROR code : No or invalid token. User probably not signed in.");
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
    let courseName = getCourseName();
    let weekNumber = getCurrentWeek();
    let weeksColumn = document.querySelector('.weeksColumn');
    clearColumns(false, true, true, true); //Clear all columns but the weeks column.Stops previous weeks contents lingerring


    //Deselecting previously selected week
    let previousSelectedWeek = document.querySelector(".selected");
    if (previousSelectedWeek) previousSelectedWeek.classList.toggle("selected"); //A previous week may not be selected if an empty course is chosen
    if (weeksColumn.childNodes[weekNumber]) {
        weeksColumn.childNodes[weekNumber].classList.toggle("selected");
    }


    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is sdpassed to the server.
    const fetchOptions = {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        },
    };
    const url = `/webserver/getWeek?courseName=${courseName}&weekNumber=${weekNumber}&token=${token}`;
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
        let jsonResponse = await response.json();
        if (jsonResponse) {
            if (jsonResponse.topics) addTextAreaToTopics(null, jsonResponse.topics);
            if (jsonResponse.notesAndIdeas) addTextAreaToNotes(null, jsonResponse.notesAndIdeas);
            if (jsonResponse.resources) addTextAreaToResources(null, jsonResponse.resources);
        }
    } else {
        console.error(`ERROR switching to week:${weekNumber}course:${courseName}`);
    }
}

/*
Get contents of text box and use their email as the owner
TODO explanation
*/
async function addCourse() {

    let courseName = document.getElementById('newCourseTextField').value;

    if (courseName) {

    //Checking if the course already exists
    let courseExists = false;
    let coursesDropdown = document.getElementById("coursesDropdown");
    for (let course in coursesDropdown.childNodes){
        if (coursesDropdown.childNodes[course].label == courseName){
            courseExists = true;
            break;
        }

    }
    if (!courseExists){
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is sdpassed to the server.
        const fetchOptions = {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
        };
        if (token) {
    saveChanges();
            const url = `/webserver/addCourse?courseName=${courseName}&token=${token}`
            let response = await fetch(url, fetchOptions);
            if (response.ok) {
                populateCoursesDropdown();
            }
            setUrlParams(1, courseName);
            clearColumns();
            await addNewWeek(false).then(async () => {
                await switchToWeek();
            });
            setCoursesDropdown(courseName);
        } else {
            console.log("Cant add course. User not signed in.");
        }
    }else {
        console.error("ERROR not adding course as it already exists. Course = "+courseName);
        reportError("You already have a course with that name");
    }
}
}

/*
TODO Explaination
Needs to load the number of weeks and the contents for the first week.
*/
async function getNumberOfWeeks(courseName) {
    const url = `/webserver/getNumberOfWeeks?courseName=${courseName}`;
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
    console.log("Saving changes...");
    //TODO update database then inform user save was successful
    let weekNumber = getCurrentWeek();
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let topicsTextAreas = document.querySelectorAll('#topicsColumnTextArea');
        let notesTextAreas = document.querySelectorAll('#notesColumnTextArea');
        let resourcesTextAreas = document.querySelectorAll('#resourcesColumnTextArea');
        let arrayOfTopicsText = nodeListToJSON(topicsTextAreas);
        console.log("saving topics contents as :" + arrayOfTopicsText);
        let arrayOfNotesText = nodeListToJSON(notesTextAreas);
        let arrayOfResourcesText = nodeListToJSON(resourcesTextAreas);
        let courseName = getCourseName();

        const url = `/webserver/updateWeek?weekNumber=${weekNumber}&courseName=${courseName}&topics=${ arrayOfTopicsText}&notesAndIdeas=${arrayOfNotesText}&resources=${arrayOfResourcesText}`;
        let response = await fetch(url);
        if (response.ok) {
            reportError("Changes saved");
        }
    } else {
        console.log("Not saving changes as \"Courses\" is selected");
    }
}

/*
TODO Explaination
*/
async function courseSelected() {
    await saveChanges().then(() => {
        clearColumns(true, true, true, true); //If clearColumns was executed before saveChanges then the week would be deleted.
    });
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    let selectedCourse = coursesDropdown.options[indexOfSelectCourse].text;
    console.log("changingToCourse" + selectedCourse);
    if (indexOfSelectCourse != 0) {; //Stops function if "Courses" is selected
        setUrlParams(1, selectedCourse);
        //TODO set save button to allowed using cursor: allowed;
        let numberOfWeeks = await getNumberOfWeeks(selectedCourse);
        for (let i = 0; i < numberOfWeeks; i++) addNewWeek(true); //true indicates it is loading weeks not creating weeks.
        if (numberOfWeeks == 0) addNewWeek(false);
        switchToWeek(); //Switched to week 1 in the course
        // if (numberOfWeeks > 0) switchToWeek(); //If statement protects from trying to load week 1 for empty course.
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
        clearColumns(false, true, true, true);
        setUrlParams(weekNumber, courseName);
        switchToWeek();
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
    weeksColumn.innerHTML = weeksColumnContents + `<div id="weeksColumnGrid"tabindex=${numberOfWeeks} >Week ${numberOfWeeks}</div>`;
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    let selectedCourse = getCourseName();
    //Adding the newly created week to the database
    if (load != true) { //Cannot use "!load" as undefined would make the code run
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is then passed to the server.
        if (token) { //Checking they are signed in
            //Adding new week to the database so the save button can run an update query on it
            if (selectedCourse != "Courses") {

                const fetchOptions = {
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                };
                console.log("Adding new week to database");
                const url = `/webserver/addWeek/?weekNumber=${numberOfWeeks}&courseName=${selectedCourse}&token=${token}`;
                let response = await fetch(url, fetchOptions);
            } else {
                console.log("Not adding week as \"Courses\" is selected");
            }
        }
    }
    for (let i = 0; i < weeksColumn.childNodes.length; i++) {
        weeksColumn.childNodes[i].addEventListener('click', bindToSwitchToWeek(i, selectedCourse));

        weeksColumn.childNodes[i].onkeypress = (e) => {
            if (e.keyCode == '13') {
                saveChanges();
                clearColumns(false, true, true, true);
                setUrlParams(i, selectedCourse);
                switchToWeek(null, selectedCourse, i);
            }
        }
        document.getElementById("newCourseTextField").onkeypress = (e) => {
            if (e.keyCode == '13') addCourse(); //keyCode 13 == enter
        }
    }
}

/*
 This function (addTextAreaToTopics) should create a new text area within the box labelled "Topics".
*/
function addTextAreaToTopics(event, contents) {
    // saveChanges();
    console.log("contents");
    console.log(contents);
    let topicsColumn = document.querySelector('.topicsColumn');
    try {
        contents = JSON.parse(contents) //Will fail if contents is undefined
        contents.map(element => {
            topicsColumn.innerHTML += '<textarea id="topicsColumnTextArea"  draggable=true placeholder="Enter Text">' + element + '</textarea>'
        });
    } catch (e) {
        let elementToAdd = document.createElement('div');
        elementToAdd.innerHTML += '<textarea id="topicsColumnTextArea" draggable=true placeholder="Enter Text"></textarea>'
        topicsColumn.appendChild(elementToAdd);
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
            notesColumn.innerHTML += '<textarea id="notesColumnTextArea"  placeholder="Enter Text" draggable=true>' + element + '</textarea>'
        });
    } catch (e) {
        let elementToAdd = document.createElement('div');
        elementToAdd.innerHTML += '<textarea id="notesColumnTextArea"  placeholder="Enter Text" draggable=true></textarea>'
        notesColumn.appendChild(elementToAdd);
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
        let elementToAdd = document.createElement('div');
        elementToAdd.innerHTML += '<textarea id="resourcesColumnTextArea"  placeholder="Enter Text"></textarea>'
        resourcesColumn.appendChild(elementToAdd);
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
    try {
        let profile = googleUser.getBasicProfile();
        document.getElementById('logoutButton').style.visibility = "visible";
        document.getElementById('saveButton').style.visibility = "visible";
        populateCoursesDropdown();
    } catch (e) {
        console.error("ERROR signing in user." + e + ". Browser cookie policy may need changing."); //TODO tell user to change cookies policy
    }
}

/*
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        clearColumns(true, true, true, true);
        document.querySelector('#coursesDropdown').innerHTML = '<option value = "0">Courses</option>>';
        document.getElementById('logoutButton').style.visibility = "hidden";
        document.getElementById('saveButton').style.visibility = "hidden";
        console.log('User signed out.');
    });
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
