/*
There are many courses. Each course has a unique ID
Each course has many weeks. A row for every week. Weeks assosiated with course by uniqueID as foreign key
Each week has assosiated topics, notes and ideas. and resouces
*/

create database if not exists coursePlannerDatabase;

--smallint is up to 32,767
-- Allowing for multi courses. E.g WEBf1 and WEBSCRIPT etc.
create table if not exists coursePlannerDatabase.courses(
    courseID int  not null auto_increment,
    numberOfWeeks smallint not null,
    primary key (courseID)
);

create table if not exists coursePlannerDatabase.weeks(
    weekNumber int not null auto_increment,
    courseID int not null references courses(courseID),
    topics varchar(255),
    notesAndIdeas varchar(255),
    resouces varchar(255),
    primary key (weekNumber)
);
