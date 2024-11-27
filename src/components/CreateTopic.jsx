import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // Ensure the path is correct
import { auth } from "../../firebase";

const CreateTopic = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("You must be signed in to create a topic.");

      await addDoc(collection(db, "topics"), {
        title,
        content,
        author: user.email, // or user.displayName
        timestamp: serverTimestamp(),
      });

      setSuccess("Topic created successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      <Typography variant="h5">Create a Topic</Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
        multiline
        rows={4}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="primary">{success}</Typography>}
    </Box>
  );
};

export default CreateTopic;
