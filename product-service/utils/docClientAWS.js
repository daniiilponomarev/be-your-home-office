import AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

AWS.config.update({
  region: process.env.AWS_REGION,
});

export const docClientAWS = new AWS.DynamoDB.DocumentClient();
export const productsTableName = process.env.PRODUCTS_TABLE;
export const stocksTableName = process.env.STOCKS_TABLE;
