/**
 * AES-GCM Encryption using Web Crypto API
 * Provides secure encryption and decryption with authenticated encryption
 */

// Configuration
const AES_CONFIG = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    defaultKey: '0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF'
} as const;

// Get secret key from environment or use default
const getSecretKey = (): string => {
    const key = import.meta.env.VITE_AES_SECRET_KEY;
    if (!key) {
        throw new Error('VITE_AES_SECRET_KEY environment variable is not set');
    }
    return key;
};

// Convert hex string to Uint8Array
const hexToBytes = (hex: string): Uint8Array => {
    if (hex.length % 2 !== 0) {
        throw new Error('Invalid hex string: length must be even');
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        const byte = parseInt(hex.substring(i, i + 2), 16);
        if (isNaN(byte)) {
            throw new Error('Invalid hex string: contains non-hex characters');
        }
        bytes[i / 2] = byte;
    }
    return bytes;
};

// Import AES key from hex string
const importAESKey = async (): Promise<CryptoKey> => {
    try {
        const keyData = hexToBytes(getSecretKey());
        return await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: AES_CONFIG.algorithm },
            false,
            ['encrypt', 'decrypt']
        );
    } catch (error) {
        throw new Error(`Failed to import AES key: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Generate random IV
const generateIV = (): Uint8Array => {
    return window.crypto.getRandomValues(new Uint8Array(AES_CONFIG.ivLength));
};

// Combine IV and encrypted data
const combineIVAndData = (iv: Uint8Array, encryptedData: ArrayBuffer): Uint8Array => {
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    return combined;
};

// Split IV and encrypted data
const splitIVAndData = (combined: Uint8Array): { iv: Uint8Array; data: Uint8Array } => {
    const iv = combined.slice(0, AES_CONFIG.ivLength);
    const data = combined.slice(AES_CONFIG.ivLength);
    return { iv, data };
};

/**
 * Encrypt plain text using AES-GCM
 * @param plainText - Text to encrypt
 * @returns Promise<string> - Base64 encoded encrypted data
 */
export const encrypt = async (plainText: string): Promise<string> => {
    try {
        if (!plainText) {
            throw new Error('Plain text cannot be empty');
        }

        const key = await importAESKey();
        const encoder = new TextEncoder();
        const data = encoder.encode(plainText);
        const iv = generateIV();

        const encrypted = await window.crypto.subtle.encrypt(
            { name: AES_CONFIG.algorithm, iv },
            key,
            data
        );

        const combined = combineIVAndData(iv, encrypted);
        return btoa(String.fromCharCode(...combined));
    } catch (error) {
        throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

/**
 * Decrypt encrypted text using AES-GCM
 * @param encryptedText - Base64 encoded encrypted data
 * @returns Promise<string> - Decrypted plain text
 */
export const decrypt = async (encryptedText: string): Promise<string> => {
    try {
        if (!encryptedText) {
            throw new Error('Encrypted text cannot be empty');
        }

        const key = await importAESKey();
        const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
        const { iv, data } = splitIVAndData(combined);

        const decrypted = await window.crypto.subtle.decrypt(
            { name: AES_CONFIG.algorithm, iv },
            key,
            data
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
