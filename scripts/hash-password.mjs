import bcrypt from 'bcryptjs';
import { createInterface } from 'readline/promises';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question('Admin password to hash: ');
rl.close();

if (!password) {
  console.error('No password entered.');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log('\nSet this as ADMIN_PASSWORD_HASH:\n');
console.log(hash);
