'use strict';
import { v4 as uuid } from 'uuid';
import time from '../common/time.js';
import { docClientAWS, productsTableName, stocksTableName } from '../utils/docClientAWS.js';

export const handler = async event => {
  console.log('createProduct | event: ', event);
  console.log('createProduct | event.body: ', event.body);
  let { title, description, price, imageUrl, count } = event.body;

  if (!title || !price) {
    console.log('createProduct | event.body parsed: ', JSON.parse(event.body));
    const parsedBody = JSON.parse(event.body);
    title = parsedBody.title;
    description = parsedBody.description;
    price = parsedBody.price;
    imageUrl = parsedBody.imageUrl;
    count = parsedBody.count;
  }

  if (!title || !price) {
    console.log('createProduct | error: Title and price are required');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Title and price are required' }),
    };
  }

  const id = uuid();
  const product = {
    id,
    title,
    description,
    price: parseInt(price, 10),
    imageUrl: imageUrl || `https://source.unsplash.com/featured?home-office-furniture&sig=${id}`,
  };
  const stock = {
    product_id: id,
    count: parseInt(count, 10),
  };

  try {
    console.log('createProduct | putting product into db: ', productsTableName, product);
    await docClientAWS.put({ TableName: productsTableName, Item: product }).promise();
    console.log('createProduct | putting stock into db: ', stocksTableName, stock);
    await docClientAWS.put({ TableName: stocksTableName, Item: stock }).promise();
  } catch (error) {
    console.log('createProduct | error: Error saving product', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error saving product' }),
    };
  }

  const timestamp = time.getTimestamp();
  const response = {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: 201,
  };
  console.log('createProduct | success: ', product, timestamp);

  return {
    ...response,
    body: JSON.stringify({ product, timestamp }),
  };
};
