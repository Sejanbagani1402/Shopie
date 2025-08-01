import { Container, CssBaseline, Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export const Home = () => {
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
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Welcome to Shopie
        </Typography>
        {isAuthenticated() ? (
          <Button
            component={Link}
            to="/profile"
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Go To Profile
          </Button>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              Sign In
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              fullWidth
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};
