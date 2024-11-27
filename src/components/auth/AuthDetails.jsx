import React, { useEffect, useState } from "react";
import { Typography, Button, Box } from "@mui/material";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const AuthDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 4,
      }}
    >
      {user ? (
        <>
          <Typography variant="h6">Welcome, {user.email}</Typography>
          <Button variant="contained" color="secondary" onClick={handleSignOut}>
            Sign Out
          </Button>
        </>
      ) : (
        <Typography variant="h6">No user is signed in</Typography>
      )}
    </Box>
  );
};

export default AuthDetails;
