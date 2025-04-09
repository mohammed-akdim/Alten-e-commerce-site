import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

async function createUser() {
  try {
    // User data
    const password = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Generated hash for password:', hashedPassword);
    
    // Test the hash immediately
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Hash verification test:', isValid);

    const user = {
      id: 1,
      username: 'admin',
      firstname: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const userData = {
      users: [user]
    };

    // Write to users.json
    const filePath = path.join(__dirname, '../../src/data/users.json');
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
    console.log('User data written to:', filePath);
    
    // Verify the file was written correctly
    const written = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log('Verification - Read from file:', written);
    
    // Test the stored hash
    const storedUser = written.users[0];
    const verifyStored = await bcrypt.compare(password, storedUser.password);
    console.log('Verification - Stored hash test:', verifyStored);

  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Run the script
createUser().catch(console.error); 