import { AttributeType, BillingMode, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";


export class SwnDatabase extends Construct{

    public readonly productTable : ITable;
    public readonly basketTable : ITable;
    public readonly orderTable : ITable;
    public readonly userTable : ITable;

    constructor(scope : Construct, id : string){
        super(scope, id);

        this.productTable = this.createProductTable();
        this.basketTable = this.createBasketTable();
        this.orderTable = this.createOrderTable();
        this.userTable = this.createUserTable();
       
    }


    private createProductTable() : ITable {
      return new Table(this, 'product', {
        partitionKey: {
          name: 'id', 
          type: AttributeType.STRING
        },
        tableName: 'product',
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST
      });
    }
    

    private createBasketTable() : ITable {
      return new Table(this, 'basket', {
        partitionKey: {
          name: 'userName', 
          type: AttributeType.STRING
        },
        tableName: 'basket',
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST
      });
    }

    private createOrderTable() : ITable {
      const orderTable = new Table(this, 'order', {
        partitionKey: {
          name : 'userName',
          type: AttributeType.STRING,
        },
        sortKey: {
          name: 'orderDate',
          type: AttributeType.STRING,
        },
        tableName: 'order',
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode: BillingMode.PAY_PER_REQUEST
      });

      return orderTable;
    };

    private createUserTable() : ITable {
      const userTable = new Table(this, 'user', {
        partitionKey: {
          name : 'userName',
          type : AttributeType.STRING,
        },
        sortKey: {
          name : 'userEmail',
          type : AttributeType.STRING,
        },
        tableName : 'user',
        removalPolicy: RemovalPolicy.DESTROY,
        billingMode : BillingMode.PAY_PER_REQUEST
      })

      return userTable;
    }

    
}
