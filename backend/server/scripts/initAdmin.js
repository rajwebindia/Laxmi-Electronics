const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

// Initialize admin user
const initAdmin = async () => {
  try {
    // Initialize database
    await initializeDatabase();

    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@laxmielectronics.com';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const [existing] = await pool.query(
      'SELECT id FROM admin_users WHERE username = ? OR email = ?',
      [defaultUsername, defaultEmail]
    );

    if (existing.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Create admin user
    await pool.query(
      `INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [defaultUsername, defaultEmail, passwordHash, 'Administrator', 'admin', true]
    );

    console.log('✅ Admin user created successfully');
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Email: ${defaultEmail}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run initialization
initAdmin();
