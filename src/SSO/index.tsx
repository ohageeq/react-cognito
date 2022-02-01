import { SubmitHandler, useForm } from "react-hook-form";
import Layout from "../Layout";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { ssoLogin, ssoLoginConfirm } from "../Authentication/api";
import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

type SignInInput = {
  email: string;
  verificationCode?: string;
};

const SignIn = () => {
  const { register, handleSubmit } = useForm<SignInInput>();
  const [confirmMode, setConfirmMode] = useState(false);
  const [session, setSession] = useState<string>("");
  const [authenticationResult, setAuthenticationResult] = useState<
    AuthenticationResultType | undefined
  >(undefined);
  const onSubmit: SubmitHandler<SignInInput> = async (data) => {
    const response = await ssoLogin({ email: data.email });
    setConfirmMode(true);
    setSession(response.Session!);
  };
  const onConfirm: SubmitHandler<SignInInput> = async (data) => {
    const response = await ssoLoginConfirm({
      email: data.email,
      session: session,
      verificationCode: data.verificationCode!,
    });
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
                disabled={confirmMode}
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
              />
            </Grid>
            {confirmMode && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Verification code"
                  type="text"
                  id="verificationCode"
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
            Sign In
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default SignIn;
