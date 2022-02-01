import React, { useState } from "react";
import Layout from "../Layout";
import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { login, signup, signupConfirm } from "../Authentication/api";
import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

type SignUpInput = {
  email: string;
  password: string;
  verificationCode?: string;
};

type Props = {
  ConfirmMode: boolean;
  AuthenticationResult?: AuthenticationResultType;
};

const SingUp = () => {
  const { register, handleSubmit } = useForm<SignUpInput>();
  const [props, setProps] = useState<Props>({
    ConfirmMode: false,
    AuthenticationResult: undefined,
  });
  const onSubmit: SubmitHandler<SignUpInput> = async (data) => {
    await signup(data);
    setProps({ ConfirmMode: true });
  };

  const onConfirm: SubmitHandler<SignUpInput> = async (data) => {
    await signupConfirm({
      email: data.email,
      verificationCode: data.verificationCode!,
    });
    const response = await login(data);
    setProps({ ...props, AuthenticationResult: response.AuthenticationResult });
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
            {props.AuthenticationResult && (
              <Container maxWidth={"md"}>
                <Typography
                  style={{ wordWrap: "break-word" }}
                >{`${JSON.stringify(
                  props.AuthenticationResult,
                  null,
                  2
                )}`}</Typography>
              </Container>
            )}
            <Grid item xs={12}>
              <TextField
                disabled={props.ConfirmMode}
                required
                fullWidth
                id="email"
                label="Email Address"
                {...register("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled={props.ConfirmMode}
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                {...register("password")}
              />
            </Grid>
            {props.ConfirmMode && (
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
            onClick={handleSubmit(props.ConfirmMode ? onConfirm : onSubmit)}
          >
            {props.ConfirmMode ? "Send verification code" : "Sign Up"}
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
