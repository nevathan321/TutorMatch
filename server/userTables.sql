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
  profile_image LONGTEXT
);

INSERT INTO Users (
  first_name, last_name, full_name, email, account_password, macid, student_number,
  major, main_subjects, wage, rating, year_of_study, dob, user_type, matched_tutors, profile_image
) VALUES
('Alice', 'Johnson', 'Alice Johnson', 'alice.johnson@gmail.com', 'hashedpass1', 'johnsa1', '000111222', 'Computer Science', JSON_ARRAY('Math', 'Algorithms'), 25.0, 5, 3, '2003-04-10', 'tutor', NULL, NULL),
('Bob', 'Smith', 'Bob Smith', 'bob.smith@gmail.com', 'hashedpass2', 'smithb2', '000222333', 'Engineering', JSON_ARRAY('Physics', 'Thermodynamics'), 30.0, 4, 4, '2002-07-19', 'tutor', NULL, NULL),
('Catherine', 'Lee', 'Catherine Lee', 'catherine.lee@gmail.com', 'hashedpass3', 'leec3', '000333444', 'Biology', JSON_ARRAY('Chemistry', 'Genetics'), 28.5, 3, 2, '2004-01-22', 'tutor', NULL, NULL),
('David', 'Patel', 'David Patel', 'david.patel@gmail.com', 'hashedpass4', 'pateld4', '000444555', 'Mathematics', JSON_ARRAY('Calculus', 'Linear Algebra'), 27.0, 2, 3, '2003-11-05', 'tutor', NULL, NULL),
('Ella', 'Nguyen', 'Ella Nguyen', 'ella.nguyen@gmail.com', 'hashedpass5', 'nguyene5', '000555666', 'Statistics', JSON_ARRAY('Data Science', 'Probability'), 29.0, 4, 4, '2002-09-30', 'tutor', NULL, NULL),
('Frank', 'Harris', 'Frank Harris', 'frank.harris@gmail.com', 'hashedpass6', 'harrisf6', '000666777', 'Software Engineering', JSON_ARRAY('Java', 'OOP'), 26.0, 5, 3, '2003-05-14', 'tutor', NULL, NULL),
('Grace', 'Kim', 'Grace Kim', 'grace.kim@gmail.com', 'hashedpass7', 'kimg7', '000777888', 'Health Sciences', JSON_ARRAY('Biology', 'Psychology'), 23.5, 1, 2, '2004-02-03', 'tutor', NULL, NULL),
('Henry', 'Zhao', 'Henry Zhao', 'henry.zhao@gmail.com', 'hashedpass8', 'zhaoh8', '000888999', 'Economics', JSON_ARRAY('Microeconomics', 'Finance'), 28.0, 2, 3, '2003-06-25', 'tutor', NULL, NULL),
('Isabella', 'Singh', 'Isabella Singh', 'isabella.singh@gmail.com', 'hashedpass9', 'singhi9', '000999000', 'Business', JSON_ARRAY('Accounting', 'Marketing'), 26.5, 3, 2, '2004-10-12', 'tutor', NULL, NULL),
('Jack', 'Brown', 'Jack Brown', 'jack.brown@gmail.com', 'hashedpass10', 'brownj10', '001000111', 'Physics', JSON_ARRAY('Astronomy', 'Quantum Mechanics'), 31.0, 4, 4, '2002-03-17', 'tutor', NULL, NULL);