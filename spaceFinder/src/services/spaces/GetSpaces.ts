import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function getSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult>{

  if(event.queryStringParameters){
     if('id' in event.queryStringParameters){
         const spaceId = event.queryStringParameters['id'];
         const getItemsResponse =await ddbClient.send(new GetItemCommand({
            TableName : process.env.TABLE_NAME,
            Key : {
                'id' : {S : spaceId}
            }
         })) 
         if (getItemsResponse.Item){
            const unmarshalledItem = unmarshall(getItemsResponse.Item)
            return {
                statusCode : 200,
                body : JSON.stringify(unmarshalledItem)
            }
         }else{
            return{
                statusCode : 404,
                body : JSON.stringify(`space with Id ${spaceId} not found!`)
            }
         }
     }else {
        return{
            statusCode : 400,
            body : JSON.stringify('Id requested!')
        }
     }
  }

    const result = await ddbClient.send(new ScanCommand({
        TableName : process.env.TABLE_NAME,
    }))
    console.log(result.Items)
    return {
        statusCode : 201,
        body : JSON.stringify(result.Items)
    }
}


