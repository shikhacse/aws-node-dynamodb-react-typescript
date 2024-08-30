import { AuthService } from "./AuthService";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DataStack, ApiStack } from '../../../spaceFinder/outputs.json';

const spacesUrl = ApiStack.SpaceApiEndpointDA7E4050 + 'spaces'

export interface SpaceEntry {
    id: string,
    location: string,
    name: string,
    photoUrl?: string
}

export class DataService {

    private authService: AuthService;
    private s3Client: S3Client | undefined;
    private awsRegion = 'us-east-2';

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public async createSpace(name: string, location:string, photo?: File){
       console.log('calling create space!!');
        const space = {} as SpaceEntry;  
        space.name = name;
        space.location = location  
        console.log(space, space.name , space.location)    
        if (photo) {
            const uploadUrl = await this.uploadPublicFile(photo);
            console.log(uploadUrl);
            space.photoUrl = uploadUrl
        }
        const postResult = await fetch(spacesUrl, {
            method: 'POST',
            body: JSON.stringify(space),
            headers: {
                'Authorization': this.authService.jwtToken!,
                'Content-Type': 'application/json'
            }
        });
        const postResultJSON = await postResult.json();
        console.log("API Response:", postResultJSON);
           return postResultJSON.id;
    }

    private async uploadPublicFile(file: File){
        const credentials = await this.authService.getTemporaryCredentials();
        if (!this.s3Client) {
            this.s3Client = new S3Client({
                credentials: credentials as any,
                region: this.awsRegion
            });
        }
        const command = new PutObjectCommand({
            Bucket: DataStack.SpaceFinderPhotosBucketName,
            Key: file.name,
            Body: file
        });
        await this.s3Client.send(command);
        return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`
    }

        public isAuthorized(){
        return true;
    }
}