import { config } from 'dotenv';
config();
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import readline from 'readline';

const prisma = new PrismaClient();

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => rl.question(query, answer => { rl.close(); resolve(answer); }));
}

function isValidEmail(email: string): boolean {
    // Simple email validation regex.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function createAdmin() {
    try {
        const email = await askQuestion('Enter admin email: ');
        if (!isValidEmail(email)) {
            console.error('Error: Provided email is invalid. Please provide a valid email address.');
            return;
        }
        const password = await askQuestion('Enter admin password: ');

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('Admin user created:', admin);
    } catch (error) {
        console.error('Error creating admin. Ensure the email is in a valid format and try again.', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
