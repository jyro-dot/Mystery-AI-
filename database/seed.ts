import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Starting database seed...');

  // Clean existing data (in development only)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.profile.deleteMany({});
    await prisma.user.deleteMany({});
  }

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'demo@mysteryai.com',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
      profiles: {
        create: {
          bio: 'A demo user for testing',
          role: 'user',
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'admin@mysteryai.com',
      name: 'Admin User',
      password: hashedPassword,
      emailVerified: new Date(),
      profiles: {
        create: {
          bio: 'Administrator account',
          role: 'admin',
        },
      },
    },
  });

  console.log('✅ Seed completed successfully');
  console.log(`Created users:`, { user1, user2 });
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
