const bcrypt = require('bcryptjs');

// Generate bcrypt hashes for passwords
async function generateHashes() {
  const adminPassword = 'admin123';
  const userPassword = 'user123';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  console.log('Admin password hash:', adminHash);
  console.log('User password hash:', userHash);

  // Generate SQL statements
  const adminId = crypto.randomUUID();
  const userId = crypto.randomUUID();

  console.log('\n-- SQL Statements to insert users:');
  console.log(`INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES ('${adminId}', 'admin@abdurblog.com', '${adminHash}', 'Admin User', 'ADMIN', NOW(), NOW());`);
  console.log(`INSERT INTO "User" (id, email, password, name, role, "createdAt", "updatedAt") VALUES ('${userId}', 'user@abdurblog.com', '${userHash}', 'Regular User', 'USER', NOW(), NOW());`);
}

generateHashes().catch(console.error);
