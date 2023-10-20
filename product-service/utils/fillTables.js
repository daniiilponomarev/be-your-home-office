import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { docClientAWS, productsTableName, stocksTableName } from './docClientAWS.js';

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

products.forEach(async product => {
  const id = uuid();

  await docClientAWS
    .put({
      TableName: productsTableName,
      Item: {
        id,
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    })
    .promise();

  await docClientAWS
    .put({
      TableName: stocksTableName,
      Item: {
        product_id: product.id,
        count: product.count,
      },
    })
    .promise();

  console.log(`Added product ${product.id} to the tables`);
});
