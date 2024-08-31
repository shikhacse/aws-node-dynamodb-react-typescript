import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'us-east-2'

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: 'us-east-2_jQrOTkGpm',
            userPoolClientId: '5b87j3sajrr1g6rchn5vaql6ub',
            identityPoolId :'us-east-2:daf15415-28f7-4588-99a1-a0c03664ae84'
        }
    }
})

export class AuthService {

    public async login(userName: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });
        return signInOutput;
    }

    /**
     * call only after login
     */
    public async getIdToken(){
        const authSession = await fetchAuthSession();
        const data = authSession.tokens?.idToken.toString();
        return data;

    }

    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-east-2_jQrOTkGpm`
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'us-east-2:daf15415-28f7-4588-99a1-a0c03664ae84',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
            })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials
    
    }

}

