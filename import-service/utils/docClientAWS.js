import { config } from 'dotenv';

config();

export const sqsQueueUrl = process.env.SQS_QUEUE_URL;
