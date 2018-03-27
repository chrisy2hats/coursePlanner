Course planner

This website is a tool for planning of university courses.Each course can have as many weeks as you want and every week has topics,notes and resources areas where you can jot down your thoughts.

**How to load/initalise the database:**
```
cd database && mysql -u root -p < initDatabase.sql
```
If your MySQL root password is NOT "root" then change the password field in config.json in the database directory.

**How to run the server:**
Navigate to the webserver directory and run
```
node server.js
```
Or run
```
npm run dashboard
```
**If you want to run the server with only errors output:**
```
node server.js 1> /dev/null #Redirect stdout to /dev/null
```
This assumes a Unix-like environment.

**Features:**
Font size dropdown - The user can select a font size from a dropdown list and all the text on the page will change size accordingly

Adding courses - The user can add a course by typing the name of the course in the box named "Course Name" and pressing enter or clicking the button "Add Course".This requires the user to be logged in.

Transfering course ownership - The user can give the course with all the contents of the course to another user by typing the email of who they want to give the course to and pressing the transfer ownership button.

Theme - You can toggle between dark and light themes by pressing the "Join the darkside button"

Courses by user - Each user can have multiple courses that are completely seperate with multiple weeks for each course

Persistance -  The changes made are saved everything the "Save Changes" button is pressed or you change week or course.Multiple text areas in each column can be saved and loaded correctly. Empty text areas are not saved.

Help page - There is a page in addition to the main page which gives the user some pointers on using the system.This can be accessed via the Help Page button

Keyboard shortcuts - Site can be navigated with keyboard shortcuts. These are listed in the help page

Google Auth - Google signin has been used in the system. Courses are assosiated with your google account. When the user signs in logout and save changes buttons becomes visible. When the logout the buttons disappear again.

Aria tags - Used within index.html to make page more screen reader friendly

Functional concepts - forEach loops used in functions such as  setGlobalFontSize function in index.js. Maps are used in functions such as addTextAreaToTopics in index.js.

Descriptive error messages in server side - Unique error code and the file the error when errors occur such as "        console.error("ERROR code : server.js07 : error in get week: " + e);"

CSS3 stuff - CSS grid and CSS variables used in /webserver/webpages/styles.css

String interpolation used in several places.

**Misc:**
For my reflective log look at "REFLECTION.md".

Some features which I haven't got around to implementing fully may have their functions in such as deleting weeks.
