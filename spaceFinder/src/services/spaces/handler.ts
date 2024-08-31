import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpaces } from "./UpdateSpaces";
import { deleteSpaces } from "./DeleteSpace";
import { JsonError, MissingFieldError } from "../shared/validator";
import { addCorsHeader } from "../shared/Utils";
import { captureAWSv3Client, getSegment } from "aws-xray-sdk-core";


const ddbClient = captureAWSv3Client(new DynamoDBClient({}))

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
    let message: string
    let response : APIGatewayProxyResult;

    const subSeg = getSegment().addNewSubsegment('MyLongCall')
    await new Promise(resolve =>{ setTimeout(resolve, 3000)});
    subSeg.close();

    const subSeg2 = getSegment().addNewSubsegment('MyShortCall')
    await new Promise(resolve =>{ setTimeout(resolve, 500)})
    subSeg2.close();

try{
   switch (event.httpMethod) {
        case 'GET':
            const getResponse = await getSpaces(event, ddbClient)
            // console.log(getResponse)
            // addCorsHeader(getResponse)
            response = getResponse;
            break;
        case 'POST':
            const postResponse  =await postSpaces(event , ddbClient)
            // addCorsHeader(postResponse)
            response = postResponse;
            break;
        case 'PUT':
            const putResponse  =await updateSpaces(event , ddbClient)
            console.log(putResponse)
            //  addCorsHeader(putResponse)
            response = putResponse;
            break;
        case 'DELETE':
            const deleteResponse  =await deleteSpaces(event , ddbClient)
            console.log(deleteResponse)
            //  addCorsHeader(deleteResponse)
            response = deleteResponse;
            break;
        default:
            break;
   }
}catch(error){
    console.log(error.message)
    if(error instanceof MissingFieldError){
        return {
            statusCode : 400,
            body : JSON.stringify(error.message)
        }
    }
     if (error instanceof JsonError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
    return {
        statusCode : 500,
        body : JSON.stringify(error.message)
    }
}
addCorsHeader(response)
  return response;
}

export {handler}
