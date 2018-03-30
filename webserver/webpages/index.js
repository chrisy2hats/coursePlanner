'use strict'
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

//Making pressing enter in the new course text field text field call it's associated function
document.getElementById("newCourseTextField").onkeypress = (e) => {
    if (e.keyCode == '13') addCourse(); //keyCode 13 == enter
}
//Making pressing enter in the new owner text field text field call it's associated function
document.getElementById("newOwnerTextField").onkeypress = (e) => {
    if (e.keyCode == '13') transferOwnershipOfCourse();
}

/*
 This function (toggleNavBar) should make the nav bar containing options pop out on the left of the page if the nav bar is
 currently hidden. If the nav bar is currently visible it should make the nav bar hidden.
*/
function toggleNavBar() {
    let navBar = document.getElementById("navBar");
    let currentWidth = navBar.style.width;
    currentWidth == "15em" ? navBar.style.width = "0em" : navBar.style.width = "15em";
}

/*
 This function (setGlobalFontSize) should be called whenever the user selects a font size from the
 font size dropdown list. ALL the text on the page should change size accordingly
*/
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

/*
 This function (reportError) should display an arbitary message to the user for an arbitary time.The message should be
 displayed by editing an element in the page NOT by using an alert
 @params String errorMessage - The error message to be displayed to the user
 @params int displayDuration - An optional parameter which effects how long the error is displayed for
*/
function reportError(errorMessage, displayDuration) {
    if (!displayDuration) displayDuration = 1000;
    let errorReportSpace = document.getElementById("errorReporter");
    errorReportSpace.textContent = errorMessage;
    errorReportSpace.style.visibility = "visible";
    setTimeout(function() {
        errorReportSpace.style.visibility = "hidden";
        errorReportSpace.textContent = "Placeholder text" // Stops invisbile text taking up lots of space it a long error message is reported
    }, displayDuration);
}

/*
 This function(getCurrentWeek) should fetch the current week from the URL.
 @return int - The week that is currently selected
*/
function getCurrentWeek() {
    let href = window.location.href;
    let url = new URL(href);
    let week = url.searchParams.get("currentWeek");
    return week;
}

/*
 This function (getCourseName) should fetch the current course from the URL.
 @return String - The currently selected course
*/
function getCourseName() {
    let href = window.location.href;
    let url = new URL(href);
    let week = url.searchParams.get("courseName");
    return week;
}

/*
 This function (setUrlParams) should set the current week number and the current course name that is stored in the URL to
 the week number and course name that are passed to it.
 @param int - weekNumber - the number of the week that should be put into the URL
 @param String - courseName - the name of the course that should be put into the URL
*/
function setUrlParams(weekNumber, courseName) {
    if (!weekNumber) weekNumber = getCurrentWeek(); //Avoids undefined being pushed to the URL
    if (!courseName) courseName = getCourseName();
    history.pushState(null, null, `/?currentWeek=${weekNumber}&courseName=${courseName}`); //Sets the URL of the page without a reload.
}

/*
 This function (setCoursesDropdown) should set the selected item in the dropdown list of courses to be whatever it is passed
 to this function. If it fails to find the course in the dropdown then an error should be output
 @param String - courseName - The course to set the dropdown to
*/
function setCoursesDropdown(courseName) {
    let coursesDropdown = document.getElementById('coursesDropdown');
    let selectedChange = false;
    for (let i = 0; i < coursesDropdown.length; i++) {
        if (coursesDropdown.options[i].text == courseName) {
            coursesDropdown.selectedIndex = i;
            selectedChange = true;
            break;
        }
    }
    if (!selectedChange) {
        console.error("ERROR whilst setting selected course to:" + courseName);
    }
}

/*
 This function (toggleTheme) should invert the backgroun colour of the page. If the background is white set it to black
 and if the background is black set it to be white. The colour of text on the page should be changed so it is NOT the
 same as the background
*/
function toggleTheme() {
    let columnTitles = document.querySelectorAll("#columnTitle");
    let button = document.getElementById('themeChanger');
    let backgroundColor = document.body.style.backgroundColor;
    if (backgroundColor == "black") {
        document.body.style.backgroundColor = "#F8F9F9";
        button.textContent = "Join the dark side!";
        columnTitles.forEach(element => {
            element.style.color = "black";
        });

    } else {
        document.body.style.backgroundColor = "black";
        button.textContent = "Join the rebel alliance!";
        columnTitles.forEach(element => {
            element.style.color = "white";
        });
    }
}


/*
 This function (transferOwnershipOfCourse) should take the string entered in the text field named "newOwnerTextField"
 and change the currently loaded. If the course transfers successfull the else should be notified. If an error occurs
 the user should be notified.
*/
async function transferOwnershipOfCourse() {
    saveChanges(); //So the new owner get the most up to date version of the course
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
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
        if (response.ok) {
            reportError((courseName + " transferred to:" + newOwnerEmail), 4000);
        } else {
            reportError("Error transferring course", 4000);
        }
    }
}


/*
 This function (deleteWeek) should remove the currently selected week from the course meaning it is removed from the UI and from the database. The user should be notified of the result
*/
//TODO remove the delted week from the UI
async function deleteWeek() {
    let dropDownList = document.querySelector('#coursesDropdown');
    let coursesDropdown = document.getElementById('coursesDropdown');
    let indexOfSelectCourse = coursesDropdown.selectedIndex;
    if (indexOfSelectCourse != 0) {
        let weekNumber = getCurrentWeek();
        let courseName = getCourseName();
        const url = `/webserver/deleteWeek?weekNumber=${weekNumber}&courseName=${courseName}`;
        let response = await fetch(url);
        if (!response.ok) console.error("ERROR error delete week: ");
    }
}

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

/*
 This function (populateCoursesDropdown) should retrieve all courses associated with the signed in users
 and put these courses into a dropdown list. The courses should only be loaded if a user is signed in.
 If they are not logged in they should be notified that their courses can't be loaded
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
            dropDownList.innerHTML = '<option value = "0">Courses</option>>'; //Stops pressing the sign in button multiple times duplicating dropdown
            for (let course in jsonResponse) {
                dropDownList.innerHTML = dropDownList.innerHTML + `<option value="${course}">${jsonResponse[course].courseName}</option`;
            }
        } else {
            console.error("ERROR code : populateCoursesDropdown01 : Invalid response from server");
        }
    } else {
        console.error("ERROR code : No or invalid token. User probably not signed in.");
        reportError("Your courses can't be loaded as you aren't logged in!");
    }
}

/*
 This function (switchToWeek) should be run whenever a user clicks on a week in the weeks column. The week should be fetched from the database inserted into the columns(topics,notes and resources).Before changing weeks the previous week NEEDS to be saved
 @params event  The event that has triggered the function to be called.This is usually a mouse click. This parameter should be disregarded.It automatically fills the first parameter when triggered from event listeners
 @params courseName the name of the course to save the database under.
 @params weekNumber the number of the week being switched to.
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

    const token = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token; //Getting the token of the currently logged in user which is passed to the server.
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
        reportError(("Error whilst switching to week:" + weekNumber), 3000);
    }
}

/*
 This function (addCourse) should create a new course on the UI and in the database.
 The name of the course should be taken from the text field with ID newCourseTextField
 Once the course is created the UI should switch to week 1 of the new course
*/
async function addCourse() {
    let courseName = document.getElementById('newCourseTextField').value;

    if (courseName) {
        //Checking if the course already exists
        let courseExists = false;
        let coursesDropdown = document.getElementById("coursesDropdown");
        for (let course in coursesDropdown.childNodes) {
            if (coursesDropdown.childNodes[course].label == courseName) {
                courseExists = true;
                break;
            }
        }
        if (!courseExists) {
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
        } else {
            console.error("ERROR not adding course as it already exists. Course = " + courseName);
            reportError("You already have a course with that name");
        }
    }
}

/*
 This function (getNumberOfWeeks) should get the number of weeks for a given course
 @param string courseName - The course to get the number of weeks for
 @return int numberOfWeeks - The number of weeks within the given course
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
 This function should (nodeListToJSON) should convert a node list into a single JSON string.
 The contents of the nodes should be put into the JSON string.
 @param nodeList nodeList - The list of nodes to be converted to a string
 @return string - the contents of the nodeList in string form
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
 This function (saveChanges) should get the contents the topics column, the notes column and the ideas column
 the contents of these three collumns should be saved to the database.
 The user should be informed of successful saves aswell errors during saving
*/
async function saveChanges() {
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
        reportError("Not saving changes. No course is selected.",3000);
    }
}

/*
 This function (courseSelected) should be called when a course is selected from the dropdown list of courses.
 It should populate the weeks column with all the weeks from the course and switch to week 1 of the course.
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
  This function (bindToSwitchToWeek) is the function which is applied to all of the weeks in the weeks column.
  It should save changes to the week, clear the week from the UI set the URL parameters to the selected week then switch to that week.
  This function works using a function called JavaScript closure where a function is returned which contains the statements to run.
  @param int weekNumber - the week number that is being switch to e.g. 2
  @param string courseName - the name of the course that is being switch to
  @return - the function to be run when a week is clicked on
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
                reportError("Changes will not be saved as your haven't selected a course", 3000);
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
                switchToWeek();
            }
        }
    }
}

/*
 This function (addTextAreaToTopics) should create a new text area within the box labelled "Topics".
 If there is no contents or the contents fails to parse a blank text area should be added.
 @param event - This is an event object such as mouseClick passed when the function is called by clicking on a button. This parameter should be disregarded
 @param JSON string - The contents of the text area(s) in the topics column.
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
 If there is no contents or the contents fails to parse a blank text area should be added.
 @param event - This is an event object such as mouseClick passed when the function is called by clicking on a button. This parameter should be disregarded
 @param JSON string - The contents of the text area(s) in the notes column.
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
 If there is no contents or the contents fails to parse a blank text area should be added.
 @param event - This is an event object such as mouseClick passed when the function is called by clicking on a button. This parameter should be disregarded
 @param JSON string - The contents of the text area(s) in the resources column.
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
 This function (clearColumns) should remove all the text areas from the topics.
 Which columns to clear can be specified in the parameters
 @param weeks boolean - if the weeks column should be cleared
 @param topics boolean - if the topics column should be cleared
 @param notes boolean - if the notes column should be cleared
 @param resources boolean - if the resources should be cleared
*/
function clearColumns(weeks, topics, notes, resources) {
    if (weeks) document.querySelector('.weeksColumn').innerHTML = "Weeks";
    if (topics) document.querySelector('.topicsColumn').innerHTML = "Topics";
    if (notes) document.querySelector('.notesColumn').innerHTML = "Notes and Ideas";
    if (resources) document.querySelector('.resourcesColumn').innerHTML = "Resources text";
}


//Google Functions. From : https://developers.google.com/identity/sign-in/web/sign-in
/*
 This function (onSignIn) is run whenever a google user presses the signin button and correctly authenticates OR whenever a signed in user loads the page.
 The function should inform the user if logging in fails
 @params googleUser The Google account being user. This is passed to the function by the Google API
*/
function onSignIn(googleUser) {
    try {
        let profile = googleUser.getBasicProfile();
        document.getElementById('logoutButton').style.visibility = "visible";
        document.getElementById('saveButton').style.visibility = "visible";
        populateCoursesDropdown();
        reportError("You are now signed in",1000);
    } catch (e) {
        console.error("ERROR signing in user." + e + ". Browser cookie policy may need changing.");
        reportError("Error signing into google account", 3000);
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
