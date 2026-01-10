const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createSampleUser() {
  try {
    const password = 'client123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'client@modelminds.com' },
    });

    if (existingUser) {
      console.log('User already exists with email: client@modelminds.com');
      console.log('Email: client@modelminds.com');
      console.log('Password: client123');
      return;
    }

    // Create sample user
    const user = await prisma.user.create({
      data: {
        name: 'Sample Client',
        email: 'client@modelminds.com',
        password: hashedPassword,
        role: 'USER',
      },
    });

    console.log('✅ Sample user created successfully!');
    console.log('\n📧 Credentials:');
    console.log('Email: client@modelminds.com');
    console.log('Password: client123');
    console.log('\nUser ID:', user.id);
    console.log('Role:', user.role);
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleUser();



