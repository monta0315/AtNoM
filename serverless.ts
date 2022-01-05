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
  resources: {
    Resources: {
      youtubeVideoTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "youtubeVideoTable",
          // Primary KeyとSort Key(あれば)の型を指定
          AttributeDefinitions: [
            {
              AttributeName: "title",
              AttributeType: "S",
            },
          ],
          // # キーの種類を指定（ハッシュorレンジキー）
          // ハッシュ＝Primary Key, レンジキー=Sort Key
          KeySchema: [
            {
              KeyType: "HASH",
              AttributeName: "title",
            },
          ],
          // プロビジョニングするキャパシティーユニットの設定
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
        },
      },
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
    iamRoleStatements: [
      {
        Effect: "Allow",
        // 許可する処理を設定
        Action: ["dynamodb:*"],
        // 処理を許可するリソースを設定
        Resource:
          "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/youtubeVideoTable",
      },
    ],
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
