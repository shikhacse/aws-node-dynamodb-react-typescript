import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";



export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    if (event.queryStringParameters && ('id' in event.queryStringParameters) && event.body) {
        try {
            const parseBody = JSON.parse(event.body);
            const requestBodyKey = Object.keys(parseBody)[0];
            
            if (!requestBodyKey) {
                throw new Error('No valid key found in the request body');
            }

            const requestBodyValue = parseBody[requestBodyKey];
            const spaceId = event.queryStringParameters['id'];

            const updatedResult = await ddbClient.send(new UpdateItemCommand({
                TableName: process.env.TABLE_NAME,
                Key: {
                    'id': { S: spaceId }
                },
                UpdateExpression: 'set #zzzNew = :new',
                ExpressionAttributeValues: {
                    ':new': { S: requestBodyValue }
                },
                ExpressionAttributeNames: {
                    '#zzzNew': requestBodyKey
                },
                ReturnValues: 'UPDATED_NEW'
            }));

            return {
                statusCode: 200,
                body: JSON.stringify(updatedResult.Attributes)
            };
        } catch (error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message })
            };
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify('Please provide the correct parameters!')
    };
}
