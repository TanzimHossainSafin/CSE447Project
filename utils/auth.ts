import jwt from 'jsonwebtoken';
export const tokenGenerator = async (data) => {
    const token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};
export const tokenVerifier = async (token: string) => {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
};  