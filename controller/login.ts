import { tokenGenerator } from "../utils/auth";
import { comparePassword } from "../utils/hashing";
import prisma from "../utils/prisma";

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
    const user = await prisma.user.findUnique({
        where: {
            email,
        }
    });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await comparePassword(password, user.hashedPassword);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = await tokenGenerator({ id: user.id, email: user.email });
        res.status(200).json({ 
            message: 'User logged in successfully', 
            token, 
            publicKey: user.publicKey,
            salt: user.salt,
            userId: user.id
        });
    } catch (error) {
        res.status(500).json({ message: 'User login failed', error: error.message});
    }
};
