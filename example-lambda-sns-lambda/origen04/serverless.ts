import type { AWS } from '@serverless/typescript';

import send from '@functions/send';

const serverlessConfiguration: AWS = {
  service: 'origin04',
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
      SNS_TOPIC_ARN: "${cf:origin04-dev.SNSTopicArn}",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["sns:Publish"],
            Resource: "${cf:origin04-dev.SNSTopicArn}",
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
      SNSTop01: { // IdLógico
        Type : "AWS::SNS::Topic", // tipo de servicio de la cola
        Properties : {
          TopicName : "SNSTop01", // nombre del topico. //id físico
        },
      },
    },
    Outputs: {
      SNSTopicArn: {
        Value: { Ref: "SNSTop01" }, //con esto puedo saber el ar del topico para poder enviar un mensaje.
      },
    }
  },
};

module.exports = serverlessConfiguration;

