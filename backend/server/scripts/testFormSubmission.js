const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

// Test form submission save
const testFormSubmission = async () => {
  try {
    await initializeDatabase();

    // Test insert
    const [result] = await pool.query(
      `INSERT INTO form_submissions 
       (form_type, name, email, phone, message, organisation_name, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'contact',
        'Test User',
        'test@example.com',
        '1234567890',
        'This is a test submission',
        'Test Company',
        '127.0.0.1',
        'Test Agent'
      ]
    );

    console.log('✅ Test form submission saved successfully');
    console.log(`   Submission ID: ${result.insertId}`);

    // Verify it was saved
    const [submissions] = await pool.query(
      'SELECT * FROM form_submissions WHERE id = ?',
      [result.insertId]
    );

    if (submissions.length > 0) {
      console.log('✅ Submission verified in database:');
      console.log('   ID:', submissions[0].id);
      console.log('   Form Type:', submissions[0].form_type);
      console.log('   Name:', submissions[0].name);
      console.log('   Email:', submissions[0].email);
    } else {
      console.log('❌ Submission not found in database');
    }

  } catch (error) {
    console.error('❌ Error testing form submission:', error);
    console.error('   Error message:', error.message);
    console.error('   Error code:', error.code);
  } finally {
    await pool.end();
  }
};

// Run test
testFormSubmission();
