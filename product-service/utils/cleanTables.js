import fs from 'fs';
import { docClientAWS, productsTableName, stocksTableName } from './docClientAWS.js';

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

products.forEach(async product => {
  await docClientAWS
    .delete({
      TableName: productsTableName,
      Key: {
        id: product.id,
      },
    })
    .promise();

  await docClientAWS
    .delete({
      TableName: stocksTableName,
      Key: {
        product_id: product.id,
      },
    })
    .promise();

  console.log(`Deleted product ${product.id} from the tables`);
});
