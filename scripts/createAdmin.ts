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
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
}

async function createAdmin() {
    try {
        const email = await askQuestion('Enter admin email: ');
        if (!isValidEmail(email)) {
            throw new Error('Provided email is invalid. Please provide a valid email address.');
        }

        const password = await askQuestion('Enter admin password: ');
        if (!isStrongPassword(password)) {
            throw new Error('Provided password is weak. Please provide a stronger password with minimum 8 characters, including uppercase, lowercase, numeric digit, and special character.');
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const admin = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });
        console.log('Admin user created:', admin);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating admin:', error.message);
        } else {
            console.error('Error creating admin:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
