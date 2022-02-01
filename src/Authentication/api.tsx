import cognito, { getTimestampString } from "./cognito";
import {
  AuthFlowType,
  ChallengeNameType,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";

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

const initiate = async ({
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
  return response.ChallengeParameters!.USERNAME;
};

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const username = await initiate({ email, password });
  const challenge = await cognito.userPool.getClientChallenge({
    username: username,
    password: password,
  });
  const response = await cognito.client.send(
    new InitiateAuthCommand({
      ClientId: cognito.clientId,
      AuthFlow: AuthFlowType.USER_SRP_AUTH,
      AuthParameters: {
        USERNAME: username,
        SRP_A: challenge.calculateA().toString("hex"),
      },
    })
  );

  const timestamp = getTimestampString(new Date());
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
      ChallengeName: response.ChallengeName,
      ChallengeResponses: {
        TIMESTAMP: timestamp,
        PASSWORD_CLAIM_SIGNATURE: sig,
        PASSWORD_CLAIM_SECRET_BLOCK: response.ChallengeParameters!.SECRET_BLOCK,
        USERNAME: username,
        USER_ID_FOR_SRP: response.ChallengeParameters!.USER_ID_FOR_SRP,
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
      ChallengeName: ChallengeNameType.CUSTOM_CHALLENGE,
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        ANSWER: verificationCode,
      },
    })
  );
};

export { signup, signupConfirm, login, ssoLogin, ssoLoginConfirm };
