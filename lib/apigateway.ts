import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface SwnApiGatewayProps{
    productMicroservice : IFunction,
    basketMicroservice : IFunction,
    orderMicroservice : IFunction,
    userMicroservice : IFunction
}

export class SwnApiGateway extends Construct{

    constructor(scope : Construct, id : string, props : SwnApiGatewayProps){
        super(scope, id);


        // Product api gateway
        this.createProductApi(props.productMicroservice);

        // Basket api gateway
        this.createBasketApi(props.basketMicroservice);

        // Order api gateway
        this.createOrderApi(props.orderMicroservice);

        this.createUserApi(props.userMicroservice);


          //Basket microservices api gateway
          //root name = basket

          //GET /basket
          //POST /basket

          //resource name = basket/{userName}

          //GET /basket/{userName}
          //DELETE /basket/{userName}

          //POST /basket/checkout
    }

    private createProductApi(productMicroservice : IFunction){
        const apigw = new LambdaRestApi(this, 'productApi', {
            restApiName : 'Product Service',
            handler: productMicroservice,
            proxy: false
          });
      
          const product = apigw.root.addResource('product');
          product.addMethod('GET'); // GET /product
          product.addMethod('POST'); // POST /product
      
          const singleProduct = product.addResource('{id}'); // product/{id}
          singleProduct.addMethod('GET'); // GET /product/{id}
          singleProduct.addMethod('PUT'); // PUT /product/{id}
          singleProduct.addMethod('DELETE'); // DELETE /product/{id}
    }

    private createBasketApi(basketMicroservice : IFunction){
        
        const apigw = new LambdaRestApi(this, 'basketApi', {
            restApiName : 'Basket Service',
            handler: basketMicroservice,
            proxy: false
          });
      
          const basket = apigw.root.addResource('basket');
          basket.addMethod('GET'); // GET /basket
          basket.addMethod('POST'); // POST /basket
      
          const singleBasket = basket.addResource('{userName}');
          singleBasket.addMethod('GET'); // GET /basket/{userName}
          singleBasket.addMethod('DELETE'); // DELETE /basket/{userName}

          const basketCheckout = basket.addResource('checkout');
          basketCheckout.addMethod('POST'); // POST /basket/checkout
            // expected request payload : { userName : swn }

    }

    private createOrderApi(orderMicroservice : IFunction){

        const apigw = new LambdaRestApi(this, 'orderApi', {
            restApiName : 'Order Service',
            handler : orderMicroservice,
            proxy: false
        });

        const order = apigw.root.addResource('order');
        order.addMethod('GET'); // GET /order

        const singleOrder = order.addResource('{userName}');
        singleOrder.addMethod('GET'); // GET /order/{userName}

        return singleOrder;
         
    }

    private createUserApi(userMicroservice : IFunction){
        const apigw = new LambdaRestApi(this, 'userApi', {
            restApiName : 'User Service',
            handler : userMicroservice,
            proxy : false
        })

        const user = apigw.root.addResource('user');
        user.addMethod('GET'); // GET /user

        const singleUser = user.addResource('{userName}');
        singleUser.addMethod('GET'); // GET /user/{userName}

        return singleUser;
    }


}