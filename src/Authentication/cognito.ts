import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {UserPool} from "cognito-srp";
import {format} from "date-fns";
import enUS from "date-fns/locale/en-US";

export const clientId: string = process.env.REACT_APP_COGNITO_CLIENT_ID ?? ""

export const client = new CognitoIdentityProviderClient({
    region: "ap-northeast-1",
    credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({}),
            identityPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID ?? ""
        }
    )
})

export const userPool = new UserPool((process.env.REACT_APP_COGNITO_USER_POOL_ID ?? "").split('_')[1])

export const getTimestamp = format(new Date(), "EEE MMM d HH:mm:ss 'UTC' yyyy", {locale: enUS});