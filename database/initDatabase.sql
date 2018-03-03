/*
There are many courses. Each course has a unique ID
Each course has many weeks. A row for every week. Weeks assosiated with course by uniqueID as foreign key
Each week has assosiated topics, notes and ideas. and resouces
*/

create database if not exists coursePlannerDatabase;

-- Allowing for multi courses. E.g WEBf1 and WEBSCRIPT etc.
create table if not exists coursePlannerDatabase.courses(
    courseName varchar(50), /*Spoken name such as WEBF1 */
    ownerEmail varchar(50)
);

create table if not exists coursePlannerDatabase.weeks(
    weekNumber int not null ,
    courseName varchar(50) not null references courses(courseName),
    topics varchar(255),
    notesAndIdeas varchar(255),
    resources varchar(255)
);
