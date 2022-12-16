const { PutItemCommand, ScanCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { ddbClient } = require("./ddbClient");



exports.handler = async function (event) {
    console.log("request: ", JSON.stringify(event, undefined, 2));

    //TODO - Catch and process Async Eventbridge invocation and sync api gateway
    if(event.Records != null){
        //SQS Invocation
        await sqsInvocation(event);
    }

    else if (event['detail-type'] !== undefined){
        //Eventbridge invocation
        await eventBridgeInvocation(event);
    }
    else{
        // API Gateway Invocation -- return sync response
        return await apiGatewayInvocation(event);
    }

}

const sqsInvocation = async (event) => {
    // Implement this
    console.log(`sqsInvocation function. event : "${event}"`);

    event.Records.forEach(async (record) => {
        console.log('Record : %j', record);

        //exptected request : {"detail-type\":\"CheckoutBasket\, \"source\":\"com.swn....\"}
        const checkoutEventRequest = JSON.parse(record.body);

        await createOrder(checkoutEventRequest.detail);
    })


}
    


const eventBridgeInvocation = async (event) => {
    console.log(`eventBridgeInvocation Function. Event : "${event}"`);
    await createOrder(event.detail);


}

const createOrder = async (basketCheckoutEvent) => {
    try{
        console.log(`createOrder function. event : "${basketCheckoutEvent}"`);

        const orderDate = new Date().toISOString();
        basketCheckoutEvent.orderDate = orderDate;
        console.log(basketCheckoutEvent);

        const params = {
            TableName : process.env.DYNAMODB_TABLE_NAME,
            Item : marshall(basketCheckoutEvent || {})
        }

        const createResult = await ddbClient.send(new PutItemCommand(params));

        console.log(createResult);

        return createResult;

    }catch(e){  
        console.error(e);
        throw e;
    }
}


const apiGatewayInvocation = async (event) => {
    // GET /order
    // GET /order/{userName}
    
    let body;

    try{
        switch(event.httpMethod){
            case "GET":
                if (event.pathParameters != null){
                    body = await getOrder(event);
                }else{
                    body = await getAllOrders();
                }
                break;
            
            default: 
                throw new Error(`Unsupported route: "${event.httpMethod}"`);    
        }

        console.log(body);

        return {
            statusCode : 200,
            body : JSON.stringify({
                message: `Successfully finished operation : "${event.httpMethod}"`,
                body: body
            })
        }


    }catch(e){
        console.error(e); 
        return {
            statusCode : 500,
            body : JSON.stringify({
                message : "Failed to perform operation.",
                errorMsg : e.message,
                errorStack : e.stack,
            })
        }
        
    }

}

const getOrder = async (event) => {
    console.log("getOrder");

    try{
        const userName = event.pathParameters.userName;
        const orderDate = event.queryStringParameters.orderDate;

        const params = {
            KeyConditionExpression : "userName = :userName and orderDate = :orderDate", 
            ExpressionAttributeValues : {
                ":userName" : { S : userName },
                ":orderDate" : { S : orderDate}
            },
            TableName : process.env.DYNAMODB_TABLE_NAME
        }

        const { Items } = await ddbClient.send(new QueryCommand(params));

        console.log( Items );

        return Items.map((item) => unmarshall(item));
    }catch(e){
        console.error(e);
        throw e;
    }
}

const getAllOrders = async () => {
     console.log("getAllOrders");

    try{
        const params = {
            TableName : process.env.DYNAMODB_TABLE_NAME
        };

        const { Items } = await ddbClient.send(new ScanCommand(params));
        
        console.log(Items);

        return (Items) ? Items.map((item) => unmarshall(item)) : {};


    }catch(e){
        console.error(e);
        throw e;
    }


}