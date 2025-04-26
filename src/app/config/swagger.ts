export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Wisiex Exchange API',
    version: '1.0.0',
    description: 'API documentation for the Wisiex Order Matching System',
  },
  servers: [
    {
      url: process.env.BASE_URL,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Check if server is alive',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                example: {
                  status: 'ok',
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login or Register',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                },
                required: ['username'],
              },
              example: {
                username: 'satoshi',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Returns JWT token',
            content: {
              'application/json': {
                example: {
                  token: 'your.jwt.token',
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                example: {
                  message: 'Invalid request',
                  errors: [
                    {
                      path: ['username'],
                      message: 'Required',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
};
