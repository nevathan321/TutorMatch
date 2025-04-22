DROP TABLE IF EXISTS Users;

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
  main_subjects JSON,
  wage FLOAT,
  rating INT,
  year_of_study INT,
  dob DATE,
  user_type VARCHAR(10) CHECK (user_type IN ('tutor', 'tutee')),
  matched_tutors JSON,
  rejected_tutors JSON,
  profile_image LONGTEXT,
  bio TEXT,

  -- Google Auth fields
  gauth_access_token TEXT,
  gauth_refresh_token TEXT,
  gauth_token_type VARCHAR(50),
  gauth_scope TEXT,
  gauth_expiry DATETIME
);

INSERT INTO Users (
  first_name, last_name, full_name, email, account_password, macid, student_number,
  major, main_subjects, wage, rating, year_of_study, dob, user_type,
  matched_tutors, rejected_tutors, profile_image, bio,
  gauth_access_token, gauth_refresh_token, gauth_token_type, gauth_scope, gauth_expiry
) VALUES
('Alice', 'Walker', 'Alice Walker', 'alice.walker@gmail.com', 'securepass1', 'walkera1', '100200300', 'Computer Science', JSON_ARRAY('AI', 'Data Structures'), 26.5, 4, 3, '2003-02-15', 'tutor', NULL, NULL, NULL, 'CS major who loves building real-world apps.', NULL, NULL, NULL, NULL, NULL),
('Brian', 'Evans', 'Brian Evans', 'brian.evans@gmail.com', 'securepass2', 'evansb2', '100200301', 'Mechanical Engineering', JSON_ARRAY('Statics', 'Dynamics'), 30.0, 5, 4, '2002-06-18', 'tutor', NULL, NULL, NULL, 'Engineer passionate about machines and motion.', NULL, NULL, NULL, NULL, NULL),
('Clara', 'Yoon', 'Clara Yoon', 'clara.yoon@gmail.com', 'securepass3', 'yoonc3', '100200302', 'Biochemistry', JSON_ARRAY('Organic Chem', 'Genetics'), 27.0, 3, 2, '2004-01-11', 'tutor', NULL, NULL, NULL, 'Helping students master science one step at a time.', NULL, NULL, NULL, NULL, NULL),
('Derek', 'Chang', 'Derek Chang', 'derek.chang@gmail.com', 'securepass4', 'changd4', '100200303', 'Mathematics', JSON_ARRAY('Algebra', 'Calculus'), 25.0, 4, 3, '2003-11-03', 'tutor', NULL, NULL, NULL, 'Math is my playground — let me guide you through it.', NULL, NULL, NULL, NULL, NULL),
('Eva', 'Sharma', 'Eva Sharma', 'eva.sharma@gmail.com', 'securepass5', 'sharmae5', '100200304', 'Statistics', JSON_ARRAY('Probability', 'Inference'), 28.0, 5, 4, '2002-10-21', 'tutor', NULL, NULL, NULL, 'Making stats intuitive and practical for every learner.', NULL, NULL, NULL, NULL, NULL),
('Farhan', 'Iqbal', 'Farhan Iqbal', 'farhan.iqbal@gmail.com', 'securepass6', 'iqbalf6', '100200305', 'Software Engineering', JSON_ARRAY('Java', 'Web Dev'), 26.0, 4, 3, '2003-05-29', 'tutor', NULL, NULL, NULL, 'Developer and teacher — passionate about clean code.', NULL, NULL, NULL, NULL, NULL),
('Grace', 'Nakamura', 'Grace Nakamura', 'grace.nakamura@gmail.com', 'securepass7', 'nakamurag7', '100200306', 'Health Sciences', JSON_ARRAY('Nutrition', 'Psychology'), 24.5, 3, 2, '2004-03-07', 'tutor', NULL, NULL, NULL, 'Let’s explore how the mind and body connect.', NULL, NULL, NULL, NULL, NULL),
('Hassan', 'Lee', 'Hassan Lee', 'hassan.lee@gmail.com', 'securepass8', 'leeh8', '100200307', 'Economics', JSON_ARRAY('Macroeconomics', 'Game Theory'), 29.0, 4, 4, '2002-08-17', 'tutor', NULL, NULL, NULL, 'Breaking down markets and strategy for curious minds.', NULL, NULL, NULL, NULL, NULL),
('Isla', 'Chen', 'Isla Chen', 'isla.chen@gmail.com', 'securepass9', 'cheni9', '100200308', 'Business', JSON_ARRAY('Marketing', 'Finance'), 27.0, 3, 3, '2003-07-10', 'tutor', NULL, NULL, NULL, 'Love helping students connect business to the real world.', NULL, NULL, NULL, NULL, NULL),
('James', 'Park', 'James Park', 'james.park@gmail.com', 'securepass10', 'parkj10', '100200309', 'Physics', JSON_ARRAY('Mechanics', 'Thermodynamics'), 31.5, 5, 4, '2002-04-04', 'tutor', NULL, NULL, NULL, 'Physics nerd who makes tough concepts easy and fun.', NULL, NULL, NULL, NULL, NULL);
