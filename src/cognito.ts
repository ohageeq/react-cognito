import {CognitoIdentityProviderClient} from "@aws-sdk/client-cognito-identity-provider";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {UserPool} from "cognito-srp";

class Cognito {
    clientId: string = process.env.REACT_APP_COGNITO_CLIENT_ID ?? ""

    client = new CognitoIdentityProviderClient({
        region: "ap-northeast-1",
        credentials: fromCognitoIdentityPool({
                client: new CognitoIdentityClient({}),
                identityPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID ?? ""
            }
        )
    })

    userPool = new UserPool((process.env.REACT_APP_COGNITO_USER_POOL_ID ?? "").split('_')[1])
}

const cognito = new Cognito()
export default cognito