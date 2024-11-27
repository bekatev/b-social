import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import NavBar from "./NavBar";
import TopicCards from "./TopicCards";
import { Typography, Box, Grid, CircularProgress } from "@mui/material";

const Home = () => {
  const [topics, setTopics] = useState([]);
  const [comment, setComment] = useState("");
  const [currentTopicId, setCurrentTopicId] = useState(null);
  const [loading, setLoading] = useState(true); // To manage the loading state
  const [user, setUser] = useState(null); // Track the current user

  const navigate = useNavigate();

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch topics from Firestore
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "topics"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const topicsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTopics(topicsList);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Handle user sign-out
  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/signin");
    });
  };

  // Show a loading indicator while checking authentication
  if (loading) {
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
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar user={user} handleSignOut={handleSignOut} />

      <Box
        sx={{
          width: "80%",
          maxWidth: "1200px",
          mx: "auto",
          flex: 1,
          px: 2,
          mt: 4,
        }}
      >
        <Typography variant="h3" sx={{ my: 2 }}>
          New Topics
        </Typography>
        <Grid container spacing={3}>
          {topics.length > 0 ? (
            topics.map((topic) => (
              <TopicCards
                key={topic.id}
                topic={topic}
                currentTopicId={currentTopicId}
                setCurrentTopicId={setCurrentTopicId}
                comment={comment}
                setComment={setComment}
              />
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
              No topics available. Be the first to create one!
            </Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
