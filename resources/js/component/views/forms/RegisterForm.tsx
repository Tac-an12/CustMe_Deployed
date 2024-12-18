import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Google, Facebook } from "@mui/icons-material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { TextField, Button, CircularProgress, Typography, Box, IconButton } from "@mui/material";
import apiServices from "../../services/apiService";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState<number[]>([]);
  const [printingSkills, setPrintingSkills] = useState<number[]>([]);
  const [bio, setBio] = useState("");
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [certificationsFiles, setCertificationsFiles] = useState<File[]>([]);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
    
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as any;

    if (state?.roleId) {
      setSelectedRole(state.roleId.toString());
    } else {
      setSelectedRole("2");
    }

    if (state?.bio) setBio(state.bio);

    if (Array.isArray(state?.portfolioFiles)) {
      setPortfolioFiles(state.portfolioFiles);
    } else if (state?.portfolioFiles) {
      setPortfolioFiles([state.portfolioFiles]);
    }

    if (Array.isArray(state?.certificationFiles)) {
      setCertificationsFiles(state.certificationFiles);
    } else if (state?.certificationFiles) {
      setCertificationsFiles([state.certificationFiles]);
    }

    if (selectedRole === "3" && state?.skills) {
      setSkills(state.skills);
    } else if (selectedRole === "4" && state?.printingServices) {
      setPrintingSkills(state.printingServices);
    }
  }, [location, selectedRole]);

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(regex.test(email) ? "" : "Invalid email address");
  };

  const validatePassword = () => {
    setPasswordError(password.length >= 6 ? "" : "Password must be at least 6 characters");
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordError(password === confirmPassword ? "" : "Passwords do not match");
  };

  const validateUsername = () => {
    setUsernameError(username.trim() ? "" : "Username is required");
  };

  const validatePhoneNumber = () => {
    const isNumeric = /^\d+$/.test(phoneNumber);
    const isValidLength = phoneNumber.length === 11; // Must be exactly 11 characters
    setPhoneNumberError(isNumeric && isValidLength ? "" : "Phone number must be 11 numeric digits");
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev); // Toggle password visibility
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev); // Toggle confirm password visibility
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    validateUsername();
    validatePhoneNumber();
  
    if (!emailError && !passwordError && !confirmPasswordError && !usernameError && !phoneNumberError) {
      const formData = new FormData();
      formData.append("role_id", selectedRole);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("firstname", firstname);
      formData.append("lastname", lastname);
      formData.append("zipcode", phoneNumber); // Map phoneNumber to zipcode for the database field
      formData.append("bio", bio);
  
      skills.forEach(skill => {
        formData.append("skills[]", skill.toString());
      });
  
      printingSkills.forEach(skill => {
        formData.append("printing_skills[]", skill.toString());
      });
  
      portfolioFiles.forEach((file, index) => {
        formData.append(`portfolio[${index}]`, file);
      });
  
      certificationsFiles.forEach((file, index) => {
        formData.append(`certificate[${index}]`, file);
      });
  
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      try {
        const response = await apiServices.post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setRegistrationSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFirstname("");
        setLastname("");
        setPhoneNumber("");
        setBio("");
        setSkills([]);
        setPrintingSkills([]);
        setPortfolioFiles([]);
        setCertificationsFiles([]);
      } catch (error: any) {
        if (error.response?.data?.errors?.email?.[0] === "The email has already been taken.") {
          setRegistrationError("The email has already been taken. Please use another unique email");
        } else if (error.response?.data?.errors?.password?.[0] === "The password field must be at least 8 characters.") {
          setRegistrationError("The password must be at least 8 characters long.");
        } else {
          setRegistrationError("An error occurred during registration. Please try again.");
        }
        
        console.error("Registration error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setRegistrationSuccess(false);
    navigate("/login");
  };

  const handleErrorModalClose = () => {
    setRegistrationError(null);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
          <div className="text-black font-extrabold text-4xl text-center">
            <span className="text-blue-500">C</span>
            <span className="text-blue-500">u</span>
            <span className="text-blue-500">s</span>
            <span className="text-yellow-500">t</span>
            <span className="text-blue-500">M</span>
            <span className="text-yellow-500">e</span>
          </div>
          <Typography variant="h6" className="text-center text-gray-700 mb-6">
            Register Your Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box mb={3} display="flex" gap={2}>
              <TextField label="First Name" variant="outlined" fullWidth value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
              <TextField label="Last Name" variant="outlined" fullWidth value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            </Box>

            <Box mb={2}>
              <TextField label="Username" variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} error={Boolean(usernameError)} helperText={usernameError} required />
            </Box>

            <Box mb={2}>
              <TextField label="Email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} error={Boolean(emailError)} helperText={emailError} required />
            </Box>

            <Box mb={2}>
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"} // Toggle between text and password
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                error={Boolean(passwordError)}
                helperText={passwordError}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={validateConfirmPassword}
                error={Boolean(confirmPasswordError)}
                helperText={confirmPasswordError}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <TextField label="Phone Number" type="number" variant="outlined" fullWidth value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} onBlur={validatePhoneNumber} error={Boolean(phoneNumberError)} helperText={phoneNumberError} required />
            </Box>

            <Button type="submit" variant="contained" fullWidth className="bg-primary text-white py-2" disabled={loading}>
              {loading ? <CircularProgress size={24} className="text-white" /> : "Register"}
            </Button>
          </form>

          {registrationSuccess && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Registration Successful</h3>
                <p className="py-4">A verification email has been sent. Please check your inbox to verify your email address.</p>
                <div className="modal-action">
                  <button className="btn" onClick={handleModalClose}>Close</button>
                </div>
              </div>
            </div>
          )}

          {registrationError && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Registration Error</h3>
                <p className="py-4">{registrationError}</p>
                <div className="modal-action">
                  <button className="btn" onClick={handleErrorModalClose}>Close</button>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold">Log In</Link>
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
