import AWS from 'aws-sdk';
import { config } from 'dotenv';

config();

const { S3_BUCKET } = process.env;
const s3 = new AWS.S3({ signatureVersion: 'v4' });

export const handler = async event => {
  console.log('importProductsFile | event: ', event);
  const { name } = event.queryStringParameters;
  const params = {
    Bucket: S3_BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv',
  };
  const signedUrl = await s3.getSignedUrlPromise('putObject', params);

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify({ signedUrl }),
  };
};
