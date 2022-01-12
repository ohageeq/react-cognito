import React, {useState} from 'react';
import './App.css';
import {
    AuthFlowType,
    CognitoIdentityProviderClient,
    InitiateAuthCommand, RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-provider-cognito-identity";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";

const client = new CognitoIdentityProviderClient({
    region: "ap-northeast-1",
    credentials: fromCognitoIdentityPool({
            client: new CognitoIdentityClient({}),
            identityPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID ?? ""
        }
    )
})

function App() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [session, setSession] = useState<string | undefined>()
    const submit = () => {
        client.send(new InitiateAuthCommand({
            ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID ?? "",
            AuthFlow: AuthFlowType.CUSTOM_AUTH,
            // AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: "password"
            }
        })).then((result) => {
            console.log(result)
            setSession(result.Session)
        }).catch((error) => {
            console.log(error)
        })
    }
    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <span>E-MAIL: </span>
                    <input type="text" onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
                    <button type="submit" onClick={submit}>ログイン</button>
                </div>
                <div>
                    <span>Password:</span>
                    <input type="password" onChange={(e) => {
                        setPassword(e.target.value)
                    }}/>
                    <button type="submit" onClick={() => {
                        client.send(new RespondToAuthChallengeCommand({
                            ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID ?? "",
                            ChallengeName: "CUSTOM_CHALLENGE",
                            ChallengeResponses: {
                                USERNAME: email,
                                ANSWER: password,
                            },
                            Session: session
                        })).then((result) => {
                            console.log(result)
                        }).catch((error) => {
                            console.log(error)
                        })
                    }}>認証
                    </button>
                </div>
                <div>
                    <button type="submit" onClick={submit}>ログイン</button>
                </div>
            </header>
        </div>
    );
}

export default App;
