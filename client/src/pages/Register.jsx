import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { RegisterForm } from "../components/auth/RegistrationForm";
import { Link as RouterLink } from "react-router-dom";

export const Register = () => {
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
          Sign Up
        </Typography>
        <RegisterForm />
        <Box sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/login" variant="body2">
            Already have an account ? Sign In
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
