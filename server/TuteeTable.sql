CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  account_password VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  macid VARCHAR(50),
  major VARCHAR(100),
  year_of_study INT,
  dob DATE 
);