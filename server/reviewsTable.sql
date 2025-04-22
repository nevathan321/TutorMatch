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

INSERT INTO Reviews (authorID, rating, title, body, authorName, datePosted, tutorID, tutorName) VALUES
(1001, 5, 'Amazing Tutor!', 'Eva explained statistics so clearly. I finally understand inference!', 'Tyler Smith', '2025-04-20', 5, 'Eva Sharma'),
(1002, 4, 'Very Helpful', 'Farhan helped me debug my Java assignment and taught me clean coding practices.', 'Meera Patel', '2025-04-19', 6, 'Farhan Iqbal'),
(1003, 3, 'Good Session', 'Grace was patient and kind, though I wish we had more time.', 'Daniel Kim', '2025-04-18', 7, 'Grace Nakamura'),
(1004, 5, 'Excellent with Calculus', 'Derek broke down limits and integrals step by step.', 'Sophia Liu', '2025-04-17', 4, 'Derek Chang'),
(1005, 4, 'Great at Explaining Concepts', 'Hassan made game theory feel intuitive.', 'Ryan Singh', '2025-04-16', 8, 'Hassan Lee'),
(1006, 2, 'Rushed Session', 'Clara knew the material but the session felt rushed.', 'Emily Tran', '2025-04-15', 3, 'Clara Yoon'),
(1007, 5, 'Inspirational', 'Alice showed me real-world applications of data structures.', 'Noah Adams', '2025-04-14', 1, 'Alice Walker'),
(1008, 4, 'Solid Tutor', 'Brian clarified all my questions about statics.', 'Liam Chen', '2025-04-13', 2, 'Brian Evans'),
(1009, 5, 'Very Professional', 'Isla helped me prep for a finance midterm with clear examples.', 'Aanya Raj', '2025-04-12', 9, 'Isla Chen'),
(1010, 5, 'Super Helpful', 'James explained thermodynamics using relatable analogies.', 'Zoe Martin', '2025-04-11', 10, 'James Park'),
(1011, 5, 'Patient and Supportive', 'Eva was kind and explained probability clearly.', 'Sarah Wong', '2025-04-10', 5, 'Eva Sharma'),
(1012, 4, 'Good Feedback', 'Farhan helped me improve my code with thoughtful suggestions.', 'Ahmed Reza', '2025-04-09', 6, 'Farhan Iqbal'),
(1013, 5, 'Awesome Experience', 'Eva helped me feel confident for my stats test.', 'Jenny Lee', '2025-04-08', 5, 'Eva Sharma');