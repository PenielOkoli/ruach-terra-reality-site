const crypto = require('crypto');

if (!process.stdin.isTTY) {
  console.error('Run this command from an interactive terminal.');
  process.exit(1);
}

let password = '';
process.stdout.write('New owner password (minimum 12 characters): ');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  if (chunk === '\u0003') process.exit(130);
  if (chunk === '\r' || chunk === '\n') {
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write('\n');
    if (password.length < 12) {
      console.error('Password must contain at least 12 characters.');
      process.exit(1);
    }
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    console.log(`ADMIN_PASSWORD_SALT=${salt}`);
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    return;
  }
  if (chunk === '\u007f' || chunk === '\b') {
    password = password.slice(0, -1);
    return;
  }
  password += chunk;
});
