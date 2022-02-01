import Layout from "./Layout";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React from "react";

const Home = () => {
  return (
    <Layout title={"Authentication"}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Cognito Authentication sample
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RouterLink to={"/signup"} style={{ color: "white" }}>
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign Up
                </Button>
              </RouterLink>
            </Grid>
            <Grid item xs={12}>
              <RouterLink to={"/signin"} style={{ color: "white" }}>
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </RouterLink>
            </Grid>
            <Grid item xs={12}>
              <RouterLink to={"/sso"} style={{ color: "white" }}>
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  SSO
                </Button>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
