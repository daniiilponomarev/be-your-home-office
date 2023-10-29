import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import { config } from 'dotenv';

config();

const { S3_BUCKET, BUCKET_SOURCE, BUCKET_DIST } = process.env;
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
          .on('data', data => {
            console.log('importFileParser | CSV Record:', data);
          })
          .on('end', async () => {
            console.log(`importFileParser | S3 object: ${s3ObjectKey} processed`);

            const source = `${S3_BUCKET}/${s3ObjectKey}`;
            const distKey = s3ObjectKey.replace(BUCKET_SOURCE, BUCKET_DIST);

            console.log(`importFileParser | Copy source ${source}`);
            console.log(`importFileParser | Destination source ${process.env.S3_BUCKET}/${distKey}`);

            await s3
              .copyObject({
                Bucket: S3_BUCKET,
                CopySource: source,
                Key: distKey,
              })
              .promise();

            console.log(`importFileParser | Copied from ${source} to ${process.env.S3_BUCKET}/${distKey}`);

            await s3
              .deleteObject({
                Bucket: process.env.S3_BUCKET,
                Key: s3ObjectKey,
              })
              .promise();

            console.log(`importFileParser | Deleted from ${source}`);

            resolve();
          })
          .on('error', error => {
            console.error('importFileParser | Error during parsing:', error);
            reject(error);
          });
      });
    } catch (e) {
      console.log('importFileParser | error', e);
    }
  }
};
