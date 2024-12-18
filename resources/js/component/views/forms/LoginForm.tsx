import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  CircularProgress,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages that trigger the dialog
  const { login, user } = useAuth(); // Access errorMessage from context
  const navigate = useNavigate();
  

  useEffect(() => {
    
    if (user) {
      switch (user?.role?.rolename) {
        case "Admin":
          navigate("/sales-reports");
          break;
        case "User":
          navigate("/user");
          break;
        case "Graphic Designer":
          navigate("/graphic-designer");
          break;
        case "Printing Shop":
          navigate("/printing-shop");
          break;
        default:
          navigate("/register");
      }
    }
  }, [user, navigate]);

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Invalid email or password.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Invalid email or password.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setIsLoading(true);
      try {
        const { success, errorMessage } = await login(email, password);

        if (!success) {
          let combinedErrorMessage = "";

          // Combine error messages if both occur
          if (errorMessage.includes("Your email is not verified")) {
            combinedErrorMessage += "Your email is not verified. Please check your email for the verification link.\n";
          }
          if (errorMessage.includes("Your account is not verified by the admin")) {
            combinedErrorMessage += "Your account is not verified by the admin.\n";
          }

          if (combinedErrorMessage) {
            setErrorMessage(combinedErrorMessage); // Set both errors
          } else {
            setEmailError("Invalid email or password");
            setPasswordError("Invalid email or password");
          }
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
        setEmailError("An unexpected error occurred.");
        setPasswordError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Dialog handling
  const handleCloseErrorDialog = () => {
    setErrorMessage(""); // Reset error state
  };

  return (
    <div className="max-w-md w-full p-8 rounded-lg shadow-2xl bg-white mx-auto mt-10">
      <div className="text-black font-extrabold text-4xl text-center">
        <span className="text-blue-500">C</span>
        <span className="text-blue-500">u</span>
        <span className="text-blue-500">s</span>
        <span className="text-yellow-500">t</span>
        <span className="text-blue-500">M</span>
        <span className="text-yellow-500">e</span>
      </div>
      <p className="text-center text-gray-600 mb-6">
        Connect with designers and printing providers
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            error={Boolean(emailError)}
            helperText={emailError}
            disabled={isLoading}
          />
        </div>

        <div className="mb-4">
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle type based on state
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
            error={Boolean(passwordError)}
            helperText={passwordError}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Link
          to="/forgot-password"
          className="text-right block text-sm text-primary hover:underline mb-4"
        >
          Forgot Password?
        </Link>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          className="bg-primary text-white py-2 rounded-lg"
        >
          {isLoading ? (
            <CircularProgress size={24} className="text-white" />
          ) : (
            "Log In"
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary font-bold">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Error Dialog for email not verified or account not verified */}
      <Dialog
        open={Boolean(errorMessage)} // Show dialog only if errorMessage exists
        onClose={handleCloseErrorDialog}
        aria-labelledby="error-dialog-title"
        aria-describedby="error-dialog-description"
      >
        <DialogTitle id="error-dialog-title">Verification Required</DialogTitle>
        <DialogContent>
          <p id="error-dialog-description">{errorMessage || "An unexpected error occurred."}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    
  );
};

export default LoginForm;
