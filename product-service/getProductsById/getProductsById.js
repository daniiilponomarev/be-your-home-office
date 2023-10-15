'use strict';
import products from '../products.json';
import time from '../common/time';

export const handler = async event => {
  console.log('getProductById | event: ', event);
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

  const product = products.find(p => p.id === productId);
  console.log('getProductById | product: ', product);

  if (!product) {
    console.log('getProductById | Product ID not found on getProductsById | products: ', products);
    return {
      ...response,
      statusCode: 404,
      body: JSON.stringify({
        message: `Product with ID ${productId} not found`,
        timestamp,
      }),
    };
  }

  product.imageUrl = `https://source.unsplash.com/featured?home-office-furniture&sig=${productId}`;

  return {
    ...response,
    statusCode: 200,
    body: JSON.stringify({ product, timestamp }),
  };
};
