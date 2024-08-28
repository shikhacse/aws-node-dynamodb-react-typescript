import { DeleteItemCommand, DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../../infra/Util";



export async function deleteSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(!hasAdminGroup(event)){
        return {
            statusCode : 401,
            body : JSON.stringify('Not Authorized!')
        }
    }
    if (event.queryStringParameters && ('id' in event.queryStringParameters)) {
 
   
            const spaceId = event.queryStringParameters['id'];

            await ddbClient.send(new DeleteItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': { S: spaceId }
                },
            }));
            return {
                statusCode: 200,
                body: JSON.stringify(`deleted space with is ${spaceId}`)
            };
      
    }

    return {
        statusCode: 400,
        body: JSON.stringify('Please provide the correct parameters!')
    };
}
