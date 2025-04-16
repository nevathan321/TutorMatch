CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  email VARCHAR(255) UNIQUE NOT NULL,
  account_password VARCHAR(255),
  macid VARCHAR(50),
  student_number VARCHAR(50),
  major VARCHAR(100),
  main_subject VARCHAR(100),
  wage FLOAT,
  year_of_study INT,
  dob DATE,
  user_type VARCHAR(10) CHECK (user_type IN ('tutor', 'tutee')),
  profile_image LONGTEXT
);