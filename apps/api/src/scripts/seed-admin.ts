import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

async function seedAdmin() {
  try {
    console.log('\n=== Create Admin User ===\n');

    const email = await question('Enter admin email: ');
    const name = await question('Enter admin name: ');
    const password = await question('Enter admin password (min 6 characters): ');

    if (!email || !password) {
      console.log('\nEmail and password are required!');
      return;
    }

    if (password.length < 6) {
      console.log('\nPassword must be at least 6 characters!');
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      const update = await question(`User ${email} already exists. Update to ADMIN role? (y/n): `);
      if (update.toLowerCase() === 'y') {
        const hashed = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: {
            password: hashed,
            name: name || existingUser.name,
            role: 'ADMIN',
          },
        });
        console.log('\n✓ User updated to ADMIN role successfully!');
      } else {
        console.log('\nCancelled.');
      }
      return;
    }

    // Create new admin user
    const hashed = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || 'Admin',
        role: 'ADMIN',
      },
    });

    console.log('\n✓ Admin user created successfully!');
    console.log(`  ID: ${admin.id}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Name: ${admin.name}`);
    console.log(`  Role: ${admin.role}`);
  } catch (error) {
    console.error('\n✗ Error creating admin user:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

seedAdmin();
