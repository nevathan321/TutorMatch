CREATE TABLE Tutees (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  account_password VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  macid VARCHAR(50),
  student_number VARCHAR(50),
  major VARCHAR(100),
  year_of_study INT,
  dob DATE 
);

CREATE TABLE Tutors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  account_password VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  macid VARCHAR(50),
  student_number VARCHAR(50),
  major VARCHAR(100),
  year_of_study INT,
  dob DATE,

  main_subject VARCHAR(50),
  wage FLOAT
);