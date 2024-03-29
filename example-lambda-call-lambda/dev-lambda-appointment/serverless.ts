import appointment from '@functions/appointment';

import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "dev-appointment",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: [
              "arn:aws:lambda:*:*:function:dev-appointment-co-dev-processor",
              "arn:aws:lambda:*:*:function:dev-appointment-mx-dev-processor",
              "arn:aws:lambda:*:*:function:dev-appointment-pe-dev-processor",
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { appointment },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;

