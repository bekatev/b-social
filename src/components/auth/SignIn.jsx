import React, { useState } from "react";
import { TextField, Button, Typography, Box, Link } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { shadows } from "@mui/system";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to the home page after successful sign-in
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card
      variant="outlined"
      component="form"
      onSubmit={handleSignIn}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: { sm: "90%", md: 400 },
        maxHeight: 400,
        margin: "auto",
        p: { xs: 3, sm: 4, md: 6, lg: 8 },
        boxShadow: 3,
      }}
    >
      <Typography variant="h5">Sign In</Typography>
      <TextField
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
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
        Sign In
      </Button>
      {error && <Typography color="error">{error}</Typography>}

      {/* Link to switch to SignUp page */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        Don't have an account?{" "}
        <Link
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("/signup"); // Navigates to the SignUp page
          }}
        >
          Sign up here
        </Link>
      </Typography>
    </Card>
  );
};

export default SignIn;
