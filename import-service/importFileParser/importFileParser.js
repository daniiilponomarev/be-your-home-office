import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { config } from 'dotenv';

config();

const { S3_BUCKET } = process.env;
const s3 = new AWS.S3({ signatureVersion: 'v4' });

export const handler = async event => {
  console.log('importFileParser | event: ', event);

  for (const record of event.Records) {
    const s3ObjectKey = record.s3.object.key;

    try {
      const getObjectParams = {
        Bucket: S3_BUCKET,
        Key: s3ObjectKey,
      };
      const s3Object = await s3.getObject(getObjectParams).promise();
      const fileContent = s3Object.Body.toString();
      console.log('importFileParser | File content:', fileContent);

      const s3Stream = s3.getObject({ Bucket: S3_BUCKET, Key: s3ObjectKey }).createReadStream();

      await new Promise((resolve, reject) => {
        s3Stream
          .pipe(csvParser())
          .on('data', (data) => {
            console.log('importFileParser | CSV Record:', data);
          })
          .on('end', () => {
            console.log(`importFileParser | S3 object: ${s3ObjectKey} processed`);
            resolve();
          })
          .on('error', (error) => {
            console.error('importFileParser | Error during parsing:', error);
            reject(error);
          });
      });
    } catch (e) {
      console.log('importFileParser | error', e);
    }
  }
};
