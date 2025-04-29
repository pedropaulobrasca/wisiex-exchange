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
        security: [],
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
        security: [],
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
    '/auth/user': {
      get: {
        tags: ['Auth'],
        summary: 'Get authenticated user information',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User information',
            content: {
              'application/json': {
                example: {
                  user: {
                    userId: 1,
                    username: 'satoshi'
                  }
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                example: {
                  message: 'Invalid token',
                },
              },
            },
          },
        },
      },
    },
    '/orders': {
      post: {
        tags: ['Orders'],
        summary: 'Create a new order',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['BUY', 'SELL'],
                  },
                  amount: {
                    type: 'number',
                    format: 'float',
                  },
                  price: {
                    type: 'number',
                    format: 'float',
                  },
                },
                required: ['type', 'amount', 'price'],
              },
              example: {
                type: 'BUY',
                amount: 0.5,
                price: 50000
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created successfully',
            content: {
              'application/json': {
                example: {
                  id: 1,
                  userId: 1,
                  type: 'BUY',
                  amount: 0.5,
                  price: 50000,
                  status: 'OPEN',
                  createdAt: '2023-05-01T12:00:00Z',
                  updatedAt: '2023-05-01T12:00:00Z'
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
                      path: ['amount'],
                      message: 'Expected number, received string',
                    },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                example: {
                  message: 'Invalid token',
                },
              },
            },
          },
        },
      },
    },
  },
};
