import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";
import { ListBackupsCommand } from "@aws-sdk/client-dynamodb";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'shikha',
        'Shikha@123'
    );
    const idToken = await service.getIdToken();
    const credentials = await service.generateTemporaryCredentials();
    const buckets = await listBuckets(credentials);
    console.log(buckets);

}


async function listBuckets(credentials: any){
    const client = new S3Client({
        credentials : credentials
    });
    const command = new ListBucketsCommand({});
    const result = await client.send(command);
    return result;
}

testAuth();