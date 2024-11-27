import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";

const NewTopicForm = ({ user }) => {
  const [newTopic, setNewTopic] = useState({ title: "", content: "" });
  const [userTopics, setUserTopics] = useState([]); // State to store the user's topics
  user = auth.currentUser;

  // Handle new topic submission
  const handleNewTopicSubmit = async () => {
    if (!newTopic.title.trim() || !newTopic.content.trim()) return;

    try {
      await addDoc(collection(db, "topics"), {
        title: newTopic.title,
        content: newTopic.content,
        timestamp: new Date(),
        comments: [], // Initialize with an empty comments array
        author: user.displayName || user.email, // Set author
      });
      setNewTopic({ title: "", content: "" }); // Clear input fields after submission
      fetchUserTopics(); // Re-fetch topics after submitting
    } catch (error) {
      console.error("Error adding topic: ", error);
    }
  };

  // Fetch topics posted by the current user
  const fetchUserTopics = async () => {
    const q = query(
      collection(db, "topics"),
      where("author", "==", user.displayName || user.email)
    );
    const querySnapshot = await getDocs(q);
    const topics = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUserTopics(topics); // Store topics in state
  };

  // Fetch topics on initial load and whenever the user changes
  useEffect(() => {
    if (user) {
      fetchUserTopics();
    }
  }, [user]);

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/signin");
    });
  };

  return (
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          width: "80%",
          maxWidth: "1200px",
          mx: "auto",
          flex: 1,
          px: 2,
          mt: 4,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Topics
        </Typography>
        <TextField
          label="Topic Title"
          variant="outlined"
          fullWidth
          value={newTopic.title}
          onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Topic Content"
          variant="outlined"
          fullWidth
          value={newTopic.content}
          onChange={(e) =>
            setNewTopic({ ...newTopic, content: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleNewTopicSubmit}
          sx={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
          }}
        >
          Add New Topic
        </Button>

        {/* List of user's submitted topics */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your Submitted Topics
          </Typography>
          <Box>
            {userTopics.length > 0 ? (
              userTopics.map((topic) => (
                <Link
                  to={`/topic/${topic.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <ListItem
                    key={topic.id}
                    sx={{
                      cursor: "pointer",
                      boxShadow: 3, // Apply shadow to the card
                      borderRadius: 2, // Apply border radius for rounded corners
                      mb: 2, // Margin bottom to create space between cards
                      ":hover": {
                        boxShadow: 6,
                      },
                    }}
                  >
                    <ListItemText
                      primary={topic.title}
                      secondary={`Posted on: ${new Date(
                        topic.timestamp?.toDate()
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                </Link>
              ))
            ) : (
              <Typography variant="body2">
                You have not submitted any topics yet.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default NewTopicForm;
