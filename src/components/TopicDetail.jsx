import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase";
import { Box, Typography, Button, TextField } from "@mui/material";
import NavBar from "./NavBar";

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const docRef = doc(db, "topics", topicId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const topicData = docSnap.data();
          setTopic(topicData);
          setComments(topicData.comments || []);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching topic: ", error);
      }
    };

    fetchTopic();
  }, [topicId]);

  const handleCommentSubmit = async () => {
    if (!user) {
      alert("You must be signed in to add a comment.");
      return;
    }

    if (!comment.trim()) return;

    const newComment = {
      author: user.displayName || user.email,
      text: comment,
      timestamp: new Date(),
    };

    try {
      const topicRef = doc(db, "topics", topicId);

      await updateDoc(topicRef, {
        comments: arrayUnion(newComment),
      });

      setComments((prevComments) => [...prevComments, newComment]);
      setComment("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      navigate("/signin");
    });
  };

  if (!topic) return <Typography variant="h6">Loading...</Typography>;

  return (
    <>
      <NavBar user={user} handleSignOut={handleSignOut} />
      <Box
        sx={{
          px: 3,
          py: 2,
          borderRadius: "16px",
          borderColor: "grey.500",
          m: 2,
          boxShadow: 10,
        }}
      >
        <Typography variant="h4">{topic.title}</Typography>
        <Typography variant="body1" sx={{ mt: 2, textAlign: "left" }}>
          {topic.content}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2, textAlign: "left", fontSize: 12 }}
        >
          Posted by: {topic.author}
        </Typography>

        {/* Comments Section */}
        <Box sx={{ mt: 3, textAlign: "left" }}>
          <Typography variant="h6">Comments:</Typography>
          {comments.length > 0 ? (
            comments
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((commentObj, index) => (
                <Box
                  key={index}
                  sx={{
                    mt: 2,
                    borderRadius: "10px",
                    borderColor: "grey.500",
                    boxShadow: 10,
                    p: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>{commentObj.author}</strong>: {commentObj.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {commentObj.timestamp
                      ? commentObj.timestamp.seconds // Firestore Timestamp
                        ? new Date(
                            commentObj.timestamp.seconds * 1000
                          ).toLocaleString()
                        : commentObj.timestamp instanceof Date // JavaScript Date
                        ? commentObj.timestamp.toLocaleString()
                        : "Invalid timestamp" // Fallback for unexpected cases
                      : "No timestamp available"}
                  </Typography>
                </Box>
              ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No comments yet.
            </Typography>
          )}
        </Box>

        {/* Add a comment */}
        <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
          <TextField
            label="Add a comment"
            variant="outlined"
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            onClick={handleCommentSubmit}
          >
            Post Comment
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default TopicDetail;
