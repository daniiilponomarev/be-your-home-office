'use strict';
import time from '../common/time.js';
import { docClientAWS, productsTableName, stocksTableName } from '../utils/docClientAWS.js';

export const handler = async event => {
  console.log('getProductById | event: ', event);
  console.log(event.pathParameters);
  console.log(event.pathParameters?.id);
  let { id: productId } = event.pathParameters || {};
  const timestamp = time.getTimestamp();
  const response = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 200,
  };

  if (typeof productId === 'string') {
    productId = productId.trim();
  }

  if (!productId) {
    console.error(`Error while trying to getProductsById - Product ID not defined`);

    return {
      ...response,
      statusCode: 400,
      body: JSON.stringify({
        message: `You should provide the product ID '/products/{id}'`,
        timestamp,
      }),
    };
  }

  const productData = await docClientAWS
    .get({
      TableName: productsTableName,
      Key: { id: productId },
    })
    .promise();
  const stockData = await docClientAWS
    .get({
      TableName: stocksTableName,
      Key: { product_id: productId },
    })
    .promise();

  if (!productData.Item) {
    console.log('getProductById | Product ID not found on getProductsById');
    return {
      ...response,
      statusCode: 404,
      body: JSON.stringify({
        message: `Product with ID ${productId} not found`,
        timestamp,
      }),
    };
  }

  const productWithStock = {
    ...productData.Item,
    imageUrl:
      productData.Item.imageUrl ||
      `https://source.unsplash.com/featured?home-office-furniture&sig=${productData.Item.id}`,
    count: stockData.Item ? stockData.Item.count : 0,
  };

  return {
    ...response,
    statusCode: 200,
    body: JSON.stringify({ productWithStock, timestamp }),
  };
};
