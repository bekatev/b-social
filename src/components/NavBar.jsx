import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

const NavBar = ({ user, handleSignOut }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  // Toggles the drawer open/close state
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  // Close the drawer automatically on screen resize for larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setDrawerOpen(false); // Close the drawer if screen is wide enough
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppBar position="sticky" sx={{ bgcolor: "info.main" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Greeting Section */}
        <Typography variant="h6" sx={{ marginRight: 2 }}>
          {user ? `Hola, ${user.displayName || user.email}` : "Hola!"}
        </Typography>

        {/* Full-Screen Navigation Buttons */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Link to="/newTopicForm" style={{ textDecoration: "none" }}>
            <Button variant="text" sx={{ color: "white" }}>
              Add New Topic
            </Button>
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="text" sx={{ color: "white" }}>
              Home
            </Button>
          </Link>
          {user && (
            <Button
              variant="text"
              color="text.primary"
              onClick={handleSignOut}
              component={Link}
              to="/signIn"
            >
              Sign Out
            </Button>
          )}
        </Box>

        {/* Hamburger Menu for Small Screens */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
          >
            <Box
              sx={{
                width: 250,
                padding: 2,
              }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {/* Close Button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="close"
                  onClick={toggleDrawer(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Links in the Hamburger Menu */}
              <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/newTopicForm">
                    <ListItemText primary="Add New Topic" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/">
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>
                {user && (
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={handleSignOut}
                      component={Link}
                      to="/signIn"
                    >
                      <ListItemText primary="Sign Out" />
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Box>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
