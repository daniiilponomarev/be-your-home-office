import { config } from 'dotenv';

config();

export const generatePolicy = (event, principalId, effect = 'Deny') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: event.routeArn,
      },
    ],
  },
});

export const handler = async (event, context, callback) => {
  console.log('basicAuthorizer | event: ', event);
  const authorizationToken = event.headers?.authorization;
  console.log('basicAuthorizer | authorizationToken: ', authorizationToken);

  if (!authorizationToken) {
    console.log('basicAuthorizer | Unauthorized (no token provided): ', authorizationToken);
    return callback('Unauthorized');
  }

  try {
    const encodedCreds = authorizationToken.split(' ')[1];
    console.log('basicAuthorizer | encodedCreds: ', encodedCreds);
    const userCreds = Buffer.from(encodedCreds, 'base64').toString().split(':');
    console.log('basicAuthorizer | userCreds: ', userCreds);

    const username = userCreds[0];
    const password = userCreds[1];

    const isAuthorized = username === process.env.GITHUB_USERNAME && password === process.env.TEST_PASSWORD;
    const effect = isAuthorized ? 'Allow' : 'Deny';
    const authResponse = generatePolicy(event, username, effect);
    console.log('basicAuthorizer | authResponse: ', authResponse);
    console.log('basicAuthorizer | authResponse.policyDocument.Statement: ', authResponse.policyDocument.Statement);
    console.log('basicAuthorizer | end of authorization process');
    callback(null, authResponse);
  } catch (e) {
    callback(`Authorization error: ${e.message}`);
  }
};
