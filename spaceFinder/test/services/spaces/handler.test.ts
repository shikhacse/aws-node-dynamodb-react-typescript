import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { handler } from "../../../src/services/spaces/handler";

const someItems = [{
    id: {
        S: '123'
    },
    location: {
        S: 'Paris'
    }
}]

jest.mock('@aws-sdk/client-dynamodb', () => {
    return {
        DynamoDBClient: jest.fn().mockImplementation(() => {
            return {
                send: jest.fn().mockImplementation(() => {
                    return {
                        Items: someItems
                    }
                })
            }
        }),
        ScanCommand: jest.fn()
    }
});

jest.mock("aws-xray-sdk-core", () => ({
      ...jest.requireActual("aws-xray-sdk-core"),
      getSegment: jest.fn().mockReturnValue({
        addNewSubsegment: jest.fn().mockReturnValue({
          close: jest.fn(),
        }),
      }),
      captureAWSv3Client: jest.fn().mockImplementation((client) => client),
    }));







describe('Spaces handler test suite', () => {

     afterAll(() => {     
     jest.clearAllMocks();
     jest.restoreAllMocks();   
});

    test('Returns spaces from dynamoDb', async () => {
        const result = await handler({
            httpMethod: 'GET'
        } as any, {} as any);

        expect(result.statusCode).toBe(201);
        const expectedResult = someItems;
        const parsedResultBody = JSON.parse(result.body);
        expect(parsedResultBody).toEqual(expectedResult);

        expect(DynamoDBClient).toHaveBeenCalledTimes(1);
        expect(ScanCommand).toHaveBeenCalledTimes(1);
    });


})