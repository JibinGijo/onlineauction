require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'your_secure_jwt_secret_key_here_make_it_long_and_random_123!@#';

if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET not found in environment variables. Using default secret. This is not secure for production!');
}

module.exports = {
    jwtSecret
}; 