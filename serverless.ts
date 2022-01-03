import atnom from "@functions/atnom";
import type { AWS } from "@serverless/typescript";
import * as dotenv from "dotenv";
dotenv.config();

const serverlessConfiguration: AWS = {
  service: "atnom2",
  frameworkVersion: "2",
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
    },
  },
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    region: "ap-northeast-1",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      ACCESS_TOKEN: process.env.ACCESS_TOKEN,
      CHANNEL_SECRET: process.env.CHANNEL_SECRET,
    },
    lambdaHashingVersion: "20201221",
  },
  // import the function via paths
  functions: { atnom },
};

module.exports = serverlessConfiguration;
