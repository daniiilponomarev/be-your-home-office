import time from '../common/time';
import { handler } from './getProductsById';

jest.mock('../common/time');
time.getTimestamp.mockImplementation(() => '2023-10-08');

describe('getProductsById', () => {
  it('lambda function is defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return product by id', async () => {
    const event = { pathParameters: { id: '1' } };
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result).toHaveProperty('body');
    expect(result.statusCode).toEqual(200);
    expect(body).toHaveProperty('product');
    expect(body).not.toHaveProperty('message');
  });

  it('should return 400 if id is not defined', async () => {
    const event = { pathParameters: {} };
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(400);
    expect(result).toHaveProperty('body');
    expect(body).toHaveProperty('message');
    expect(body.message).toContain('You should provide the product ID');
  });

  it('should return 400 if id is empty string', async () => {
    const event = { pathParameters: { id: ' ' } };
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(400);
    expect(result).toHaveProperty('body');
    expect(body).toHaveProperty('message');
    expect(body.message).toContain('You should provide the product ID');
  });

  it('should return 404 if id is not defined', async () => {
    const event = { pathParameters: { id: 'wrong id' } };
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(404);
    expect(result).toHaveProperty('body');
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('Product with ID wrong id not found');
  });
});
