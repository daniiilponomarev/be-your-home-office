'use strict';
import productList from '../products.json';
import time from '../common/time';

export const handler = async event => {
  console.log('getProductList | event: ', event);
  const products = productList.map(p => ({
    ...p,
    imageUrl: `https://source.unsplash.com/featured?home-office-furniture&sig=${p.id}`,
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
