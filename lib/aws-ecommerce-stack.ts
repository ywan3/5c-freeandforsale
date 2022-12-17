import * as cdk from 'aws-cdk-lib';
import * as sqs from '@aws-cdk/aws-sqs';
import { Construct } from 'constructs';
import { SwnDatabase } from './database';
import { SwnMicroservices } from './microservice';
import { SwnApiGateway } from './apigateway';
import { SwnEventBus } from './eventbus';
import { Duration } from 'aws-cdk-lib';
import { SwnQueue } from './queue';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
// import { Function, Runtime, Code} from 'aws-cdk-lib/aws-lambda';
// import { join } from 'path';




export class AwsEcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    const database = new SwnDatabase(this, 'Database');
  
    const microservices = new SwnMicroservices(this, 'Microservices', {
      productTable : database.productTable,
      basketTable : database.basketTable,
      orderTable : database.orderTable,
      userTable : database.userTable
    });

    const apiGateway = new SwnApiGateway(this, 'ApiGateway', {
      productMicroservice : microservices.productMicroservice,
      basketMicroservice : microservices.basketMicroservice,
      orderMicroservice : microservices.orderMicroservice,
      userMicroservice : microservices.userMicroservice
    });


    const queue = new SwnQueue(this, 'Queue', {
      consumer : microservices.orderMicroservice
    });

    const eventbus = new SwnEventBus(this, 'EventBus', {
      publisherFunction : microservices.basketMicroservice,
      targetQueue : queue.orderQueue
    });


    //Product microservices api gateway
    // root name = product

    // product
    // GET /product
    // POST /product

    // GET /product/{id}
    // PUT /product/{id}
    // DELETE /product{id}






    // const fn = new Function(this, 'MyFunction', {
    //   runtime: Runtime.NODEJS_14_X,
    //   handler: 'index.handler', 
    //   code: Code.fromAsset(join(__dirname, 'lambda-handler')),
    // });


    

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsEcommerceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
