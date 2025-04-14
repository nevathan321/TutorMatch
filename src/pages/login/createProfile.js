import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProfile.css";

const SIGNUP_ENDPOINT = "http://localhost/tutorMatch/server/signup/"
export default function CreateProfile({ setIsLoggedIn, setUserProfile,  email, firstName, lastName }) {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("tutee");

  const [formData, setFormData] = useState({
    first_name: firstName,
    last_name: lastName,
    email: email,
    macid: "",
    student_number: "",
    major: "",
    year_of_study: "",
    dob: "",
    password: "",
    confirmPassword: "",
    main_subject: "",
    wage: "",
  });

  const handleInputChange = (e) => {//update state whenever fields are updated
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const userData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      name: `${formData.first_name} ${formData.last_name}`,
      email: formData.email,
      macid: formData.macid,
      student_number: formData.student_number,
      major: formData.major,
      year_of_study: formData.year_of_study,
      dob: formData.dob,
      account_password: formData.password,
      ...(userType === "tutor" && {
        main_subject: formData.main_subject,
        wage: parseFloat(formData.wage),
      }),
    };

    try {
      const response = await fetch(`${SIGNUP_ENDPOINT}?type=${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      console.log(response)
      if (result.user_exists) {
        alert("User already exists with this email!");
      } else if (result.status === "success") {
        console.log("Registration successful!");

        setUserProfile(userData)
        setIsLoggedIn(true)
        navigate("/")
      } else {
        alert("Registration failed: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>Create Your Account</h1>
        <p className="subtitle">
          Join our community by filling out the form below
        </p>

        <div className="user-type-toggle">
          <button
            className={`toggle-btn ${userType === "tutee" ? "active" : ""}`}
            onClick={() => setUserType("tutee")}>
            I'm a Tutee
          </button>
          <button
            className={`toggle-btn ${userType === "tutor" ? "active" : ""}`}
            onClick={() => setUserType("tutor")}>
            I'm a Tutor
          </button>
        </div>
      </div>

    
      <div className="details-card">
        <h2 className="form-title">
          {userType === "tutee" ? "Tutee Details" : "Tutor Details"}
        </h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                readOnly
              />
            </div>

            <div className="form-group">
              <label htmlFor="macid">McMaster ID</label>
              <input
                type="text"
                id="macid"
                name="macid"
                value={formData.macid}
                onChange={handleInputChange}
                placeholder="Enter McMaster ID"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="student_number">Student Number</label>
              <input
                type="text"
                id="student_number"
                name="student_number"
                value={formData.student_number}
                onChange={handleInputChange}
                placeholder="Enter student number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="major">Major</label>
              <input
                type="text"
                id="major"
                name="major"
                value={formData.major}
                onChange={handleInputChange}
                placeholder="Enter your major"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="year_of_study">Year of Study</label>
              <select
                id="year_of_study"
                name="year_of_study"
                value={formData.year_of_study}
                onChange={handleInputChange}
                required>
                <option value="">Select year</option>
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
                <option value="5">Fifth Year+</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {userType === "tutor" && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="main_subject">Main Subject</label>
                  <input
                    type="text"
                    id="main_subject"
                    name="main_subject"
                    value={formData.main_subject}
                    onChange={handleInputChange}
                    placeholder="Subject you tutor"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="wage">Hourly Wage ($)</label>
                  <input
                    type="number"
                    id="wage"
                    name="wage"
                    value={formData.wage}
                    onChange={handleInputChange}
                    placeholder="20.00"
                    min="0"
                    step="0.50"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group full-width">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              required
            />
            {formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="warning-message">Passwords don't match!</p>
              )}
          </div>

          <div className="form-actions">
            <button className="btn secondary" type="reset">
              Cancel
            </button>
            <button className="btn primary" type="submit">
              {userType === "tutee" ? "Sign Up as Tutee" : "Sign Up as Tutor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
