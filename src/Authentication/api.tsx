import cognito from "../cognito";
import {
  AuthFlowType,
  ChallengeNameType,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { format } from "date-fns";
import enUS from "date-fns/locale/en-US";

const dateFormat = (date: Date) =>
  format(date, "EEE MMM d HH:mm:ss 'UTC' yyyy", { locale: enUS });

const signup = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  return await cognito.client.send(
    new SignUpCommand({
      ClientId: cognito.clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "mode", Value: "password" }],
    })
  );
};

const signupConfirm = async ({
  email,
  verificationCode,
}: {
  email: string;
  verificationCode: string;
}) => {
  return await cognito.client.send(
    new ConfirmSignUpCommand({
      ClientId: cognito.clientId,
      Username: email,
      ConfirmationCode: verificationCode,
    })
  );
};

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const challenge = await cognito.userPool.getClientChallenge({
    username: email,
    password: password,
  });
  const response = await cognito.client.send(
    new InitiateAuthCommand({
      ClientId: cognito.clientId,
      AuthFlow: AuthFlowType.USER_SRP_AUTH,
      AuthParameters: {
        USERNAME: email,
        SRP_A: challenge.calculateA().toString("hex"),
      },
    })
  );

  const timestamp = dateFormat(new Date());
  const session = challenge.getSession(
    response.ChallengeParameters!.SRP_B,
    response.ChallengeParameters!.SALT
  );
  const sig = session.calculateSignature(
    response.ChallengeParameters!.SECRET_BLOCK,
    timestamp
  );
  return await cognito.client.send(
    new RespondToAuthChallengeCommand({
      ClientId: cognito.clientId,
      ChallengeName: ChallengeNameType.PASSWORD_VERIFIER,
      Session: response.Session,
      ChallengeResponses: {
        ...response.ChallengeParameters,
        TIMESTAMP: timestamp,
        PASSWORD_CLAIM_SIGNATURE: sig,
        PASSWORD_CLAIM_SECRET_BLOCK: response.ChallengeParameters!.SECRET_BLOCK,
      },
    })
  );
};

const ssoLogin = async ({ email }: { email: string }) => {
  return await cognito.client.send(
    new InitiateAuthCommand({
      ClientId: cognito.clientId,
      AuthFlow: AuthFlowType.CUSTOM_AUTH,
      AuthParameters: {
        USERNAME: email,
      },
    })
  );
};

const ssoLoginConfirm = async ({
  email,
  session,
  verificationCode,
}: {
  email: string;
  session: string;
  verificationCode: string;
}) => {
  return await cognito.client.send(
    new RespondToAuthChallengeCommand({
      ClientId: cognito.clientId,
      ChallengeName: ChallengeNameType.PASSWORD_VERIFIER,
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: verificationCode,
      },
    })
  );
};

export { signup, signupConfirm, login, ssoLogin, ssoLoginConfirm };
