import bcrypt from 'bcryptjs';
import readline from 'readline';
import { isStrongPassword } from '../src/utils/passwordValidator'; 
import { config as appConfig } from '../src/config/config';
import { prisma } from '../src/utils/prisma';
import logger from '../src/utils/logger'; // added logger import

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, answer => { rl.close(); resolve(answer); }));
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createAdmin() {
    try {
        const email = await askQuestion('Enter admin email: ');
        if (!isValidEmail(email)) {
            throw new Error('Provided email is invalid. Please provide a valid email address.');
        }

        const password = await askQuestion('Enter admin password: ');
        if (!isStrongPassword(password)) {
            throw new Error('Provided password is weak. Please provide a stronger password with minimum 10 characters, including uppercase, lowercase, numeric digit, and special character.');
        }

        const saltRounds = appConfig.BCRYPT_SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        logger.info('Admin user created:', admin); // replaced console.log
    } catch (error) {
        if (error instanceof Error) {
            logger.error('Error creating admin:', error.message); // replaced console.error
        } else {
            logger.error('Error creating admin:', error); // replaced console.error
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
