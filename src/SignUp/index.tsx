import React, { useState } from "react";
import Layout from "../Layout";
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { signup, signupConfirm } from "../Authentication/api";

type SignUpInput = {
  email: string;
  password: string;
  verificationCode?: string;
};

const SingUp = () => {
  const { register, handleSubmit } = useForm<SignUpInput>();
  const [confirmMode, setConfirmMode] = useState(false);
  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    signup(data);
    setConfirmMode(true);
  };

  const onConfirm: SubmitHandler<SignUpInput> = async (data) => {
    signupConfirm({
      email: data.email,
      verificationCode: data.verificationCode!,
    });
  };

  return (
    <Layout title={"Authentication | Sign Up"}>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                disabled={confirmMode}
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
                disabled={confirmMode}
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </Grid>
            {confirmMode && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="verificationCode"
                  label="verification code"
                  {...register("verificationCode")}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit(confirmMode ? onConfirm : onSubmit)}
          >
            {confirmMode ? "Send verification code" : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <RouterLink to={"/signin"}>
                <Link variant="body2">Already have an account? Sign in</Link>
              </RouterLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
};

export default SingUp;
