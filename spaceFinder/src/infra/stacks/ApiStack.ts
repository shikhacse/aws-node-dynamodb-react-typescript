import {Stack, StackProps} from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs'

interface ApiStackProps extends StackProps{
    spacesLambdaIntegration : LambdaIntegration
}

export class ApiStack extends Stack{
   constructor(scope: Construct , id: string, props : ApiStackProps){
       super(scope, id, props)

       const api = new RestApi(this, 'SpaceApi');
       const spacesResources = api.root.addResource('spaces');
       spacesResources.addMethod('GET', props.spacesLambdaIntegration)
        spacesResources.addMethod('POST', props.spacesLambdaIntegration)
   }
}