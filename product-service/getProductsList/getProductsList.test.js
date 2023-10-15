import time from '../common/time';
import { handler } from './getProductsList';

jest.mock('../common/time');
time.getTimestamp.mockImplementation(() => '2023-10-08');

describe('getProductsList', () => {
  it('lambda function is defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return product list', async () => {
    const event = {};
    const result = await handler(event);
    const body = JSON.parse(result.body);

    expect(result).toHaveProperty('body');
    expect(body).toHaveProperty('timestamp');
    expect(body.timestamp).toEqual('2023-10-08');
    expect(body).toHaveProperty('products');
  });
});
