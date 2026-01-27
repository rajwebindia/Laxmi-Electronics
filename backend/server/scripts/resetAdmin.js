const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

// Reset admin user password
const resetAdmin = async () => {
  try {
    await initializeDatabase();

    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Hash password
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Update or create admin user
    const [existing] = await pool.query(
      'SELECT id FROM admin_users WHERE username = ?',
      [defaultUsername]
    );

    if (existing.length > 0) {
      // Update existing user
      await pool.query(
        'UPDATE admin_users SET password_hash = ?, is_active = TRUE WHERE username = ?',
        [passwordHash, defaultUsername]
      );
      console.log('✅ Admin password reset successfully');
    } else {
      // Create new user
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@laxmielectronics.com';
      await pool.query(
        `INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [defaultUsername, defaultEmail, passwordHash, 'Administrator', 'admin', true]
      );
      console.log('✅ Admin user created successfully');
    }

    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run reset
resetAdmin();
