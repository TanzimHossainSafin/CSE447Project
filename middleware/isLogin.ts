
import { tokenVerifier } from '../utils/auth';

export const isLogin = async (req, res, next) => {
    // Check for both Authorization and token headers
    let authHeader = req.headers.authorization;
    
    // If Authorization header is not present, check for token header
    if (!authHeader && req.headers.token) {
        authHeader = req.headers.token as string;
    }
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    
    const bearerToken = authHeader.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ message: 'Token missing' });
    }
    
    try {
        const decoded = await tokenVerifier(bearerToken) as { id: number };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};