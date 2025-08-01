import { useEffect, useState } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Button,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import { AuthService } from "../api/auth";
import { clearAuthData } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await AuthService.getProfile();
        setUser(response.data.user);
      } catch (error) {
        console.error(`Failed to fetch profile: ${error}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  const handleLogout = async () => {
    await AuthService.logout();
    navigate("/login");
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <>Error loading profile</>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        <Typography component="h1" variant="h5">
          Profile
        </Typography>
        <Box sx={{ mt: 3, width: "100%" }}>
          <Typography varian="body1">Username: {user.username}</Typography>
          <Typography varian="body1">Email: {user.email}</Typography>
          <Typography varian="body1">Role: {user.role}</Typography>
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
