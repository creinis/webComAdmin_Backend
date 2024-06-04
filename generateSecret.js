import { randomBytes } from 'crypto';

const jwtSecret = randomBytes(64).toString('hex');
console.log(jwtSecret);
