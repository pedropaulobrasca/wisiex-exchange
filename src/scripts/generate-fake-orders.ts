import prisma from '../application/database/prisma-client';
import { faker } from '@faker-js/faker';
import { OrderQueue } from '../application/redis/order-queue';

async function generateFakeData() {
  console.log('🛠️ Generating fake users and orders...');

  for (let i = 0; i < 5; i++) {
    const username = faker.internet.userName();

    const user = await prisma.user.create({
      data: {
        username,
        usdBalance: 100_000,
        btcBalance: 100,
      },
    });

    // Cada usuário cria entre 1 e 5 ordens aleatórias
    const orderCount = faker.number.int({ min: 1, max: 5 });

    for (let j = 0; j < orderCount; j++) {
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          type: faker.helpers.arrayElement(['BUY', 'SELL']),
          amount: parseFloat(faker.number.float({ min: 0.01, max: 2 }).toFixed(3)),
          price: faker.number.int({ min: 9000, max: 11000 }),
          status: 'OPEN',
        },
      });

      await OrderQueue.addOrder(order);
    }
  }

  console.log('✅ Fake users and orders created!');
}

generateFakeData()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
