DROP TABLE IF EXISTS Reviews;

CREATE TABLE Reviews (
  id SERIAL PRIMARY KEY,
  authorID INT NOT NULL,
  rating INT,
  title VARCHAR(255),
  body TEXT,
  authorName VARCHAR(100),
  datePosted DATE,
  tutorID INT NOT NULL,
  tutorName VARCHAR(100)
);