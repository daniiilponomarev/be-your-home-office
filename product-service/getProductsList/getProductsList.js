'use strict';
import time from '../common/time.js';
import { docClientAWS, productsTableName, stocksTableName } from '../utils/docClientAWS.js';

export const handler = async event => {
  console.log('getProductList | event: ', event);

  const productsData = await docClientAWS.scan({ TableName: productsTableName }).promise();
  const stocksData = await docClientAWS.scan({ TableName: stocksTableName }).promise();

  const productsWithStocks = productsData.Items.map(product => {
    const stock = stocksData.Items.find(s => s.product_id === product.id);
    return {
      ...product,
      count: stock ? stock.count : 0,
    };
  });

  console.log('getProductList | products: ', productsWithStocks);

  const products = productsWithStocks.map(p => ({
    ...p,
    imageUrl: p.imageUrl || `https://source.unsplash.com/featured?home-office-furniture&sig=${p.id}`,
  }));
  const timestamp = time.getTimestamp();
  console.log('getProductList | timestamp: ', timestamp, '\nproducts', products);

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ products, timestamp }),
  };
};
