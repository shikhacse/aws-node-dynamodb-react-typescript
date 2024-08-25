import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
    let message: string
   switch (event.httpMethod) {
    case 'GET':
        message = " hello from GET!"
        break;
    case 'POST':
        message = " hello from POST!"  
        break;
   
    default:
        break;
   }
  const response : APIGatewayProxyResult = {
    statusCode : 200,
    body : message
  }
  return response;
}

export {handler}
