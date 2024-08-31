
import { randomUUID } from "crypto";
import { JsonError } from "./validator";
import { APIGatewayProxyResult } from "aws-lambda";

export function createRandomId(){
    return randomUUID();
}
export function addCorsHeader(arg:APIGatewayProxyResult){
    if(!arg.headers){
       arg.headers ={}
    }
    arg.headers['Access-Control-Allow-Origin'] = '*'
    arg.headers['Access-Control-Allow-Methods'] = '*'
}
export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message)
    }
}