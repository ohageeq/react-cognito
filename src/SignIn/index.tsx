import { SubmitHandler, useForm } from "react-hook-form";
import Layout from "../Layout";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";
import { login } from "../Authentication/api";
import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

type SignInInput = {
  email: string;
  password: string;
};

const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInInput>();
  const [authenticationResult, setAuthenticationResult] = useState<
    AuthenticationResultType | undefined
  >(undefined);
  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    const response = await login(data);
    setAuthenticationResult(response.AuthenticationResult);
  };
  return (
    <Layout title={"Authentication | Sign In"}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {authenticationResult && (
              <Typography>{`result:${JSON.stringify(
                authenticationResult
              )}`}</Typography>
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(onSubmit)}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouterLink to={"/signup"}>
                <Link variant="body2">Register account? Sign up</Link>
              </RouterLink>
              <RouterLink to={"/sso"}>
                <Link variant="body2">SSO login</Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default SignIn;
