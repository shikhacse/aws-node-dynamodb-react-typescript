
import { randomUUID } from "crypto";
import { JsonError } from "./validator";

export function createRandomId(){
    return randomUUID();
}

export function parseJSON(arg: string){
    try {
        return JSON.parse(arg);
    } catch (error) {
        throw new JsonError(error.message)
    }
}