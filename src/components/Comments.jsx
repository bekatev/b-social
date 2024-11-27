import React, { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { TextField, Button, Box } from "@mui/material";

const AddComment = ({ topicId, onCommentAdded }) => {
  const [comment, setComment] = useState("");

  const handleAddComment = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be signed in to comment.");
      return;
    }

    const newComment = {
      text: comment,
      author: user.email,
      timestamp: new Date(),
    };

    try {
      const topicRef = doc(db, "topics", topicId);

      // Update the Firestore document
      await updateDoc(topicRef, {
        comments: arrayUnion(newComment),
      });

      // Clear the input field
      setComment("");

      // Notify the parent component of the new comment
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
      <TextField
        label="Add a comment"
        fullWidth
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleAddComment} variant="contained" color="primary">
        Post
      </Button>
    </Box>
  );
};

export default AddComment;
