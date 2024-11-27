import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

const TopicCards = ({
  topic,
  currentTopicId,
  setCurrentTopicId,
  comment,
  setComment,
}) => {
  // Handle comment submission
  const handleCommentSubmit = async (topicId) => {
    if (!comment.trim()) return; // Don't allow empty comments

    const topicRef = doc(db, "topics", topicId);

    try {
      await updateDoc(topicRef, {
        comments: [...(topic.comments ?? []), comment],
      });
      setComment(""); // Clear comment input after submission
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={topic.id}>
      <Link to={`/topic/${topic.id}`} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            cursor: "pointer",
            boxShadow: 3,
            borderRadius: 2,
            mb: 2,
            height: 200,
            ":hover": {
              boxShadow: 6,
              p: 0.1,
              mb: 1.9,
              mt: -0.1,
              mr: -0.1,
              ml: -0.1,
            },
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", textAlign: "left" }}
            >
              {topic.title}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
                textAlign: "left",
                color: "primary.main",
              }}
            >
              Posted by: {topic.author}
            </Typography>
            {/* Truncated content with ellipsis */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 1,
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3, // Limit the number of lines
                WebkitBoxOrient: "vertical",
              }}
            >
              {topic.content}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};

export default TopicCards;
