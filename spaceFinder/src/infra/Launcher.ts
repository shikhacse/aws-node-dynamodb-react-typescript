import { App } from "aws-cdk-lib";
import { ApiStack } from "./stacks/ApiStack";
import { DataStack } from "./stacks/DataStacks";
import { LambdaStack } from "./stacks/LambdaStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack"
import { MonitorStack } from "./stacks/MonitorStack";

const app = new App();
const dataStack = new DataStack(app, 'DataStack');
const authStack = new AuthStack(app, 'AuthStack', {
    photosBucket : dataStack.photosBucket
})
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
    spacesTable : dataStack.spacesTable
});
new ApiStack(app, 'ApiStack',
    {
    spacesLambdaIntegration : lambdaStack.spacesLambdaIntegration,
    userPool : authStack.userPool
    } 
)

new UiDeploymentStack(app, 'UiDeploymentStack')
new MonitorStack(app, 'MonitorStack')
