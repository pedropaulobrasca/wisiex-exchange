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
    schemas: {
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['BUY', 'SELL'] },
          amount: { type: 'number', format: 'float' },
          price: { type: 'number', format: 'float' },
          status: { type: 'string', enum: ['OPEN', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Match: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          buyerId: { type: 'string', format: 'uuid' },
          sellerId: { type: 'string', format: 'uuid' },
          price: { type: 'number', format: 'float' },
          volume: { type: 'number', format: 'float' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Statistics: {
        type: 'object',
        properties: {
          lastPrice: { type: 'number', format: 'float', nullable: true },
          btcVolume: { type: 'number', format: 'float' },
          usdVolume: { type: 'number', format: 'float' },
          high: { type: 'number', format: 'float', nullable: true },
          low: { type: 'number', format: 'float', nullable: true },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      OrderBook: {
        type: 'object',
        properties: {
          bids: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                price: { type: 'number', format: 'float' },
                volume: { type: 'number', format: 'float' }
              }
            }
          },
          asks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                price: { type: 'number', format: 'float' },
                volume: { type: 'number', format: 'float' }
              }
            }
          }
        }
      },
      Balance: {
        type: 'object',
        properties: {
          btc: { type: 'number', format: 'float' },
          usd: { type: 'number', format: 'float' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                path: { type: 'array', items: { type: 'string' } },
                message: { type: 'string' }
              }
            }
          }
        }
      }
    }
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
                    userId: '1f1bdaab-7033-496d-9eda-3d8b2f99330f',
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
                schema: {
                  $ref: '#/components/schemas/Order'
                },
                example: {
                  id: '1f1bdaab-7033-496d-9eda-3d8b2f99330f',
                  userId: '9a9d5a6e-7c5b-4f8a-b2c7-1d3e4f5a6b7c',
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
                schema: {
                  $ref: '#/components/schemas/Error'
                },
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
      get: {
        tags: ['Orders'],
        summary: 'Get active orders for authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of active orders',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Order'
                  }
                },
                example: [
                  {
                    id: '1f1bdaab-7033-496d-9eda-3d8b2f99330f',
                    userId: '9a9d5a6e-7c5b-4f8a-b2c7-1d3e4f5a6b7c',
                    type: 'BUY',
                    amount: 0.5,
                    price: 50000,
                    status: 'OPEN',
                    createdAt: '2023-05-01T12:00:00Z',
                    updatedAt: '2023-05-01T12:00:00Z'
                  }
                ],
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
    '/orders/{orderId}': {
      delete: {
        tags: ['Orders'],
        summary: 'Cancel an existing order',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'orderId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              format: 'uuid'
            },
            description: 'ID of the order to cancel'
          }
        ],
        responses: {
          '200': {
            description: 'Order canceled successfully',
            content: {
              'application/json': {
                example: {
                  message: 'Order cancelled successfully'
                },
              },
            },
          },
          '400': {
            description: 'Error canceling order',
            content: {
              'application/json': {
                example: {
                  message: 'Order not found or not open'
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
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                example: {
                  message: 'You can only cancel your own orders'
                },
              },
            },
          },
        },
      },
    },
    '/matches': {
      get: {
        tags: ['Matches'],
        summary: 'Get all matches in the system',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of all matches',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Match'
                  }
                },
                example: [
                  {
                    id: 'b3c9a1d8-7e6f-4b5a-9c7d-1e8f9a0b7c6d',
                    buyerId: '9a9d5a6e-7c5b-4f8a-b2c7-1d3e4f5a6b7c',
                    sellerId: '7c6b5a4e-3f2d-1e9c-8b7a-6d5e4f3c2b1a',
                    price: 50000,
                    volume: 0.25,
                    createdAt: '2023-05-01T12:05:00Z'
                  }
                ],
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
    '/matches/my-matches': {
      get: {
        tags: ['Matches'],
        summary: 'Get matches for the authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'List of user matches',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Match'
                  }
                },
                example: [
                  {
                    id: 'b3c9a1d8-7e6f-4b5a-9c7d-1e8f9a0b7c6d',
                    buyerId: '9a9d5a6e-7c5b-4f8a-b2c7-1d3e4f5a6b7c',
                    sellerId: '7c6b5a4e-3f2d-1e9c-8b7a-6d5e4f3c2b1a',
                    price: 50000,
                    volume: 0.25,
                    createdAt: '2023-05-01T12:05:00Z'
                  }
                ],
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
    '/order-book': {
      get: {
        tags: ['Trading'],
        summary: 'Get the current order book',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Order book with bids and asks',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/OrderBook'
                },
                example: {
                  bids: [
                    { price: 45000, volume: 1.25 },
                    { price: 44900, volume: 0.75 }
                  ],
                  asks: [
                    { price: 45100, volume: 0.5 },
                    { price: 45200, volume: 1.0 }
                  ]
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
    '/statistics': {
      get: {
        tags: ['Trading'],
        summary: 'Get market statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Market statistics',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Statistics'
                },
                example: {
                  lastPrice: 45000,
                  btcVolume: 2.5,
                  usdVolume: 112500,
                  high: 45500,
                  low: 44500,
                  updatedAt: '2023-05-01T12:10:00Z'
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
    '/user/balance': {
      get: {
        tags: ['User'],
        summary: 'Get authenticated user balance',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User balance',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Balance'
                },
                example: {
                  btc: 5.25,
                  usd: 125000
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
