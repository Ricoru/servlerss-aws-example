import type { AWS } from '@serverless/typescript';

import send from '@functions/send';

const serverlessConfiguration: AWS = {
  service: 'origen05',
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
      SNS_TOPIC_ARN: "arn:aws:sns:us-east-1:340044566512:SNSTopic06"
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: "arn:aws:sns:us-east-1:340044566512:SNSTopic06",
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
      SQSQueue06: { // IdLógico de los recursos
        Type : "AWS::SQS::Queue", // tipo de servicio de la cola
        Properties : {
            QueueName : "SQSAWS06", // nombre de la cola. //id físico
        },
      },
      SNSTopic06: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "SNSTopic06",
          Subscription: [ // subscripciones al sns topic
            {
              Protocol: "sqs", // Si fuera correo sería email
              Endpoint: { "Fn::GetAtt": ["SQSQueue06", "Arn"] },
            },
          ],
        },
      },
      SQSQueuePolicy06: { // Está politica es para que el sns topic pueda enviar mensajes a la cola
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "sqs:SendMessage",
                Resource: { "Fn::GetAtt": ["SQSQueue06", "Arn"] },
                Principal: "*",
                Condition: {
                  ArnEquals: {
                    "aws:SourceArn": { Ref: "SNSTopic06" },
                  },
                },
              },
            ],
          },
          Queues: [{ Ref: "SQSQueue06" }],
        },
      },
    },
    Outputs: {
      SNSTopic06Arn: {
        Value: { Ref: "SNSTopic06" },
      },
    }
  },
};

module.exports = serverlessConfiguration;
