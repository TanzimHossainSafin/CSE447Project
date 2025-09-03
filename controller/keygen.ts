import { generateKeyPair } from "../utils/keygen";

export const keygen = async (req, res) => {
    const { privateKey, publicKey } = await generateKeyPair();
    res.status(200).json({ privateKey, publicKey });
}