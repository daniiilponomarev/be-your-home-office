import AWS from 'aws-sdk';
import { docClientAWS, productsTableName, snsTopicArn, stocksTableName } from '../utils/docClientAWS.js';

const sns = new AWS.SNS();

export const handler = async event => {
  console.log('catalogBatchProcess | event: ', event);
  console.log('catalogBatchProcess | event.Records: ', event.Records);

  for (const record of event.Records) {
    const product = JSON.parse(record.body);
    console.log('catalogBatchProcess | Processing product:', product);

    const { id, title, description, price } = product;

    if (!id || !title || !description || !price) {
      console.error('catalogBatchProcess | Failed to create product: no required properties', product);
      return;
    }

    const productDB = {
      id,
      title,
      description,
      price: parseInt(price, 10),
      imageUrl: product.imageUrl || `https://source.unsplash.com/featured?home-office-furniture&sig=${id}`,
    };
    const stockDB = {
      product_id: product.id,
      count: parseInt(product.count, 10),
    };

    try {
      console.log('createProduct | putting product into db: ', productsTableName, productDB);
      await docClientAWS.put({ TableName: productsTableName, Item: productDB }).promise();
      console.log('createProduct | putting stock into db: ', stocksTableName, stockDB);
      await docClientAWS.put({ TableName: stocksTableName, Item: stockDB }).promise();
      console.log('catalogBatchProcess | Product created:', product);
      await sns
        .publish({
          Subject: 'Product Created',
          Message: `New product added: ${JSON.stringify(product)}`,
          TopicArn: snsTopicArn,
        })
        .promise();
      console.log('catalogBatchProcess | Email sent');
    } catch (err) {
      console.error('catalogBatchProcess | Failed to create product:', err);
    }
  }
};
