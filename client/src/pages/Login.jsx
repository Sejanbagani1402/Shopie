import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoginForm } from "../components/auth/LoginForm";
import { Link as RouterLink } from "react-router-dom";

export const Login = () => {
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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <LoginForm />
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/register" variant="body2">
            Don't have an account ? Sign Up
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
