import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import * as rds from '@aws-cdk/aws-rds'; 
import * as apigw from '@aws-cdk/aws-apigatewayv2';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';

export class CdkAuroraServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the VPC needed for the Aurora Serverless DB cluster
    const vpc = new ec2.Vpc(this, 'AuroraVPC');

    // Create the Serverless Aurora DB cluster; set the engine to Postgres
    const cluster = new rds.ServerlessCluster(this, 'AuroraTestCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-postgresql10'),
      defaultDatabaseName: 'TestDB',
      vpc,
      scaling: { autoPause: cdk.Duration.seconds(0) } // Optional. If not set, then instance will pause after 5 minutes 
    });

    // Create the Lambda function that will map GraphQL operations into Postgres
    const postFn = new lambda.Function(this, 'MyFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('lambda-functions'),
      handler: 'index.handler',
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'TestDB'
      },
    });

    // Grant access to the cluster from the Lambda function
    cluster.grantDataApiAccess(postFn);
  
     // create the API Gateway with one method and path
     let api = new apigw.HttpApi(this, 'Endpoint', {
      defaultIntegration: new integrations.LambdaProxyIntegration({
        handler: postFn
      })
    });

    new cdk.CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });

  }
}
