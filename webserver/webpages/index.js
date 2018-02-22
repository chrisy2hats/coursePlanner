console.log("index.js called."+Math.floor(Math.random() *20)); //Non static message to check page is reloaded.

document.getElementById('newWeekButton').addEventListener('click', addNewWeek);

function onSignIn(googleUser) {
    // try { //Try catch is needed incase the user is blocking 3rd party cookies.This appears to be the default in Chromium.
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // } catch (e) {
    //     console.log("error in getting logged in user info: " + e);
    // }
}

function addNewWeek(){
    console.log("addNewWeek called");
}
