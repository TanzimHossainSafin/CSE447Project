import { hashPassword } from '../utils/hashing';
import prisma from '../utils/prisma';
export const register = async (req, res) => {
    const { username, email, password, publicKey, salt } = req.body;
    const hashedPassword = await hashPassword(password);
    // Handle registration logic here
    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                hashedPassword,
                publicKey,
            }
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'User registration failed', error: error.message });
    }
};
