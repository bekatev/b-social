import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import Home from "./components/Home";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import TopicDetail from "./components/TopicDetail";
import NewTopicForm from "./components/NewTopicForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null); // Tracks the current logged-in user
  const [loading, setLoading] = useState(true); // Tracks if Firebase is still resolving the user state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if logged in, or null if logged out
      setLoading(false); // Stop loading once the state is resolved
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  if (loading) {
    // Display a loading spinner while Firebase resolves the authentication state
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Router basename="/b-social">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Routes>
          {/* Redirect to Home if the user is logged in */}
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/signin" />}
          />
          {/* Route for the SignIn page */}
          <Route
            path="/signin"
            element={!user ? <SignIn /> : <Navigate to="/" />}
          />
          {/* Route for the SignUp page */}
          <Route
            path="/signup"
            element={!user ? <SignUp /> : <Navigate to="/" />}
          />
          {/* Dynamic route for topic details */}
          <Route
            path="/topic/:topicId"
            element={user ? <TopicDetail /> : <Navigate to="/signin" />}
          />
          <Route
            path="/newTopicForm"
            element={user ? <NewTopicForm /> : <Navigate to="/signin" />}
          />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
