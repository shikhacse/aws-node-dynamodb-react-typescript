import {CfnOutput, Stack, StackProps} from 'aws-cdk-lib'
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway'
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs'

interface AuthStackProps extends StackProps {
    photosBucket : IBucket
}

export class AuthStack extends Stack{

    public userPool : UserPool;
    private userPoolclient : UserPoolClient;
    private identityPool : CfnIdentityPool;
    private authenticated : Role;
    private unAuthenticatedRole : Role;
    private adminRole : Role;

   constructor(scope: Construct , id: string, props? : AuthStackProps){
       super(scope, id, props)

    this.createUserPool();
    this.createUserPoolClient();
    this.createIdentityPool();
    this.createRoles(props.photosBucket);
    this.attachRoles();
    this.createAdminsGroup();
   }
  
   

   private createUserPool(){
      this.userPool = new UserPool(this, 'SpaceUserPool', {
        selfSignUpEnabled : true,
        signInAliases : {
           username : true,
           email : true 
        }
      });
      new CfnOutput(this, 'SpaceUserPoolId', {
        value : this.userPool.userPoolId
      })
   }

    private createUserPoolClient(){
     this.userPoolclient = this.userPool.addClient('SpaceUserPoolClient', {
        authFlows : {
            adminUserPassword : true,
            custom : true,
            userPassword: true,
            userSrp : true
        }
     });
     new CfnOutput(this, 'SpaceUserPoolClient', {
        value : this.userPoolclient.userPoolClientId
     })
   }

   private createAdminsGroup(){
    new CfnUserPoolGroup(this, 'SpaceAdmins', {
        userPoolId : this.userPool.userPoolId,
        groupName : 'admins',
        roleArn : this.adminRole.roleArn
    })
   }

   private createIdentityPool(){
    this.identityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
       allowUnauthenticatedIdentities : true,
       cognitoIdentityProviders : [{
        clientId : this.userPoolclient.userPoolClientId,
        providerName : this.userPool.userPoolProviderName
       }]
    });
      new CfnOutput(this, 'SpaceIdentityPoolId', {
        value : this.identityPool.ref
     })
   }


   private createRoles(photosBucket : IBucket) {
      this.authenticated = new Role(this, 'CognitoDefaultAuthenticatedRole', {
     assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            ) 
        }); 
        this.unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        });
        this.adminRole = new Role(this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        }); 
        this.adminRole.addToPolicy(new PolicyStatement ({
            effect : Effect.ALLOW,
            actions : [
                's3:PutObject',
                's3:PutObjectAcl'
            ],
            resources : [photosBucket.bucketArn + '/*']
        }))
    }

    private  attachRoles() {
        new CfnIdentityPoolRoleAttachment(this, 'RolesAttchment', {
            identityPoolId : this.identityPool.ref,
            roles : {
                'authenticated' : this.authenticated.roleArn,
                'unauthenticated' : this.unAuthenticatedRole.roleArn
            },
            roleMappings : {
                adminsMapping : {
                    type : 'Token',
                    ambiguousRoleResolution : 'AuthenticatedRole',
                    identityProvider : `${this.userPool.userPoolProviderName}:${this.userPoolclient.userPoolClientId}`
                }
            }
        })
    }
}