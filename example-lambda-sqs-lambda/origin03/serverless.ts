import type { AWS } from '@serverless/typescript';

import send from '@functions/send';

const serverlessConfiguration: AWS = {
  service: 'origin03',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SQS_QUEUE_URL: "${cf:origin03-dev.SQSQueueUrl}",
      /*SQS_QUEUE_URL:
        "https://sqs.us-east-1.amazonaws.com/340044566512/RICORUDEV01",*/
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage"],
            Resource: "${cf:origin03-dev.SQSQueueArn}", // "arn:aws:sqs:us-east-1:340044566512:RICORUDEV01", //es porque el lambda está enviando la información a una sola cola, pero puede enviar a uno o más agrupado por []
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { send },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      SQSQueue: { // IdLógico de los recursos
        Type : "AWS::SQS::Queue", // tipo de servicio de la cola
        Properties : {
            QueueName : "RICORUDEV01", // nombre de la cola. //id físico
        },
      },
    },
    Outputs: {
      SQSQueueArn: {
        Value: { "Fn::GetAtt": ["SQSQueue", "Arn"] },
      },
      SQSQueueName: {
        Value: { "Fn::GetAtt": ["SQSQueue", "QueueName"] },
      },
      SQSQueueUrl2: {
        Value: { "Fn::GetAtt": ["SQSQueue", "QueueUrl"] },
      },
      SQSQueueUrl: {
        Value: { Ref: "SQSQueue" }, // Este Ref permite obtener el la url de la cola
      },
    }
  },
};

module.exports = serverlessConfiguration;
