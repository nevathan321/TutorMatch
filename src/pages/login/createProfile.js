/**
 * Date: 2025-04-23
 * Team: WebFusion
 * Team Members: Nevathan, Liyu, Adrian, Abishan
 * Description: This component handles the creation of a user profile during the TutorMatch signup flow.
 * It captures user details, validates passwords, conditionally renders additional fields for tutors, 
 * and submits the data to the backend. Upon success, it updates the login state and navigates to the homepage.
 */



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProfile.css";

// Define the endpoint for signing up users
const SIGNUP_ENDPOINT = "https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/signup/";

/**
 * Handles the creation of a user profile during signup.
 *
 * @param {Object} props
 * @param {Function} props.setIsLoggedIn - Function to update login state after successful signup.
 * @param {Function} props.setUserProfile - Function to store user profile in state after signup.
 * @param {string} props.email - Email of the user, prefilled from Google login.
 * @param {string} props.firstName - First name of the user, prefilled from Google login.
 * @param {string} props.lastName - Last name of the user, prefilled from Google login.
 *
 * @returns {JSX.Element} Signup form with validation, role toggle, and server submission.
 */

export default function CreateProfile({ setIsLoggedIn, setUserProfile, email, firstName, lastName }) {
  const navigate = useNavigate();
  
  // State for the user type (either 'tutee' or 'tutor')
  const [userType, setUserType] = useState("tutee");
  const [passwordError, setPasswordError] = useState(" ");
  

  // Initial state for the form data
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

  /**
   * Handles input field changes by updating form state.
   * Also triggers password validation if the password field is being modified.
   *
   * @param {Object} e - The input change event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password when it's being typed
    if (name === "password") {
      validatePassword(value);
    }
  };


  /**
   * Validates the password for minimum requirements:
   * - At least 8 characters
   * - Contains at least one digit
   *
   * @param {string} password - The password string to validate.
   * @returns {boolean} - True if valid, false otherwise.
   */
  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    } else if (!/\d/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  /**
   * Handles form submission for creating a new user profile.
   * Verifies password match, builds the data payload, submits it to the backend,
   * and processes the server's response.
   *
   * On successful signup, stores the user session and triggers Google OAuth login.
   *
   * @param {Object} e - The form submission event.
   * @async
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If passwords don't match, show an alert and prevent form submission
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Prepare the user data to be sent to the server
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
      // Send the POST request with the user data to the server
      const response = await fetch(`${SIGNUP_ENDPOINT}?type=${userType}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Parse the server's response
      const result = await response.json();

      // If the user already exists, alert the user
      if (result.user_exists) {
        alert("User already exists with this email!");
      } else if (result.status === "success") {
        // If registration is successful, update state and navigate to the home page
        setUserProfile(result.user);
        setIsLoggedIn(true);
        localStorage.setItem("userEmail", userData.email); 
        navigate("/"); // Navigate to the home page
      } else {
        // Show an error message if registration fails
        alert("Registration failed: " + result.message);
      }

      const authWindow = window.open(
        "https://cs1xd3.cas.mcmaster.ca/~xiaol31/TutorMatch/server/authenticate.php",
        "googleAuth",
        "width=600,height=600"
      );
      
      const checkAuthWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkAuthWindow);
          window.location.href = "/";
          window.location.reload();
        }
      }, 500);
    } catch (error) {
      // Log any errors that occur during the registration process
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h1>TutorMatch</h1>
        <p className="subtitle">
          Create Your Account
        </p>

      </div>


      <div className="details-card">
        <h2 className="form-title">
          {userType === "tutee" ? "Tutee Details" : "Tutor Details"}
        </h2>

        {/* The form for creating a user profile */}
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="create-profile-form-group">
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

            <div className="create-profile-form-group">
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
            <div className="create-profile-form-group">
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

            <div className="create-profile-form-group">
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
            <div className="create-profile-form-group">
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

            <div className="create-profile-form-group">
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
            <div className="create-profile-form-group">
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

            <div className="create-profile-form-group">
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

          {/* Additional fields for tutor users */}
          {userType === "tutor" && (
            <>
              <div className="form-row">
                <div className="create-profile-form-group">
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

                <div className="create-profile-form-group">
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

          <div className="form-row">
            <div className="create-profile-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password (min 8 chars, with a number)"
                required
              />
              {passwordError && <p className="warning-message">{passwordError}</p>}
            </div>

            <div className="create-profile-form-group">
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
          </div>

          {/* Action buttons for canceling or submitting the form */}
          <div className="form-actions">
            <button className="btn secondary" type="reset">
              Cancel
            </button>
            <button className="btn primary" type="submit" disabled={!!passwordError || formData.password !== formData.confirmPassword}>
              {userType === "tutee" ? "Sign Up" : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
