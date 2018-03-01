console.log("index.js called."+Math.floor(Math.random() *20)); //Non static message to check page is reloaded.

//Binding HTML buttons to their appropriate JavaScript functions
document.getElementById('newWeekButton').addEventListener('click', addNewWeek);
document.getElementById('logoutButton').addEventListener('click', signOut);
document.getElementById('newTopicButton').addEventListener('click',addTextAreaToTopics);
document.getElementById('newNotesAndIdeasButton').addEventListener('click',addTextAreaToNotes);
document.getElementById('newResourceButton').addEventListener('click',addTextAreaToResources);


/*
 TODO description of function
*/
function addNewWeek(){
    let numberOfWeeks = document.querySelectorAll('#weeksColumnGrid').length; //This is 0 indexed.
    let weeksColumn = document.querySelector('.weeksColumn');
    let weeksColumnContents = weeksColumn.innerHTML;
    weeksColumn.innerHTML = weeksColumnContents + '<div id="weeksColumnGrid" draggable="true" >Week '+(numberOfWeeks+1)+'</div>'; //TODO make this less hard coded
}

/*
 TODO description of function
*/
function addTextAreaToTopics(){
    let topicsColumn = document.querySelector('.topicsColumn');
    let topicsColumnContents = topicsColumn.innerHTML;
    topicsColumn.innerHTML = topicsColumnContents + '<textarea id="topicsColumnTextArea"  placeholder="asdasdasd">asdasd</textarea>'
}

/*
 TODO description of function
*/
function addTextAreaToNotes(){
    let notesColumn = document.querySelector('.notesColumn');
    let notesColumnContents = notesColumn.innerHTML;
    notesColumn.innerHTML = notesColumnContents + '<textarea id="notesColumnTextArea"  placeholder="asdasdasd">asdasd</textarea>'
}

/*
 TODO description of function
*/
function addTextAreaToResources(){
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
  window.userID = googleUser.getBasicProfile().getId(); //TODO find a better way of allowing other functions to check login status
  var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

/*
 This function (signOut) is only ran when the uses presses on the "logout" button.The function should sign out the user and set a global variable to allow other functions to check if the user is signed in.
*/
function signOut() {
    window.userID = undefined;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
