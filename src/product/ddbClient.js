import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const ddbClient = new DynamoDBClient({region: 'us-east-2'});

export { ddbClient };