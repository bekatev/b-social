import React, { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's profile with the username
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      setSuccess("Account created successfully!");
      setEmail("");
      setPassword("");
      setUsername("");

      // Redirect to the Sign-In page after successful sign-up
      navigate("/signin");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSignUp}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: 400,
        maxHeight: 400,
        margin: "auto",
        p: { xs: 4, md: 6, lg: 8 },
        boxShadow: 3,
        fontFamily: "Monospace",
      }}
    >
      <Typography variant="h5">Register!</Typography>
      {/* Username field */}
      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      {/* Email field */}
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {/* Password field */}
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Sign Up
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
      {/* Link to switch to SignIn page */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/signin"); // Navigates to the SignIn page
          }}
        >
          Sign in here
        </Link>
      </Typography>
    </Card>
  );
};

export default SignUp;
