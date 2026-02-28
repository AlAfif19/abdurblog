import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Default admin credentials
    const email = process.env.ADMIN_EMAIL || 'admin@abdurblog.com';
    const name = process.env.ADMIN_NAME || 'Admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('\n=== Creating Admin User ===\n');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user to admin
      const hashed = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email },
        data: {
          password: hashed,
          name: name || existingUser.name,
          role: 'ADMIN',
        },
      });
      console.log('✓ User updated to ADMIN role successfully!');
      console.log(`  Email: ${email}`);
      console.log(`  Password: ${password}`);
      console.log(`  Name: ${name}`);
      console.log(`  Role: ADMIN`);
    } else {
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

      console.log('✓ Admin user created successfully!');
      console.log(`  ID: ${admin.id}`);
      console.log(`  Email: ${email}`);
      console.log(`  Password: ${password}`);
      console.log(`  Name: ${name}`);
      console.log(`  Role: ADMIN`);
    }

    console.log('\n🔑 Login credentials:');
    console.log(`  URL: http://localhost:3000/login`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}\n`);
  } catch (error) {
    console.error('\n✗ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
