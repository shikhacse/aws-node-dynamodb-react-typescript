import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { DataStack } from "./stacks/DataStacks";
import { LambdaStack } from "./stacks/LambdaStack";
import { AuthStack } from "./stacks/AuthStack";



const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const authStack = new AuthStack(app, 'AuthStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    spacesTable : dataStack.spacesTable
});
new ApiStack(app, 'ApiStack',
    {
    spacesLambdaIntegration : lambdaStack.spacesLambdaIntegration,
    userPool : authStack.userPool
    } 
)
