import bcrypt from 'bcryptjs';

async function testPassword() {
  const password = 'admin123';
  console.log('Testing password:', password);
  
  // Test with current stored hash
  const currentHash = '$2a$10$dVvxVXVmQFEPxvWmh6DMU.zrwz3Z7GM/kS8CoYK0tlYFXkxEJWmNi';
  console.log('\nTesting current hash:', currentHash);
  const isCurrentValid = await bcrypt.compare(password, currentHash);
  console.log('Is current hash valid:', isCurrentValid);
  
  // Generate and test a new hash
  console.log('\nGenerating new hash...');
  const salt = await bcrypt.genSalt(10);
  console.log('Generated salt:', salt);
  const newHash = await bcrypt.hash(password, salt);
  console.log('Generated hash:', newHash);
  
  // Verify the new hash
  const isNewValid = await bcrypt.compare(password, newHash);
  console.log('Is new hash valid:', isNewValid);
}

// Execute the test
testPassword().catch(console.error); 