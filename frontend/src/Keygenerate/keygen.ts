// RSA Key Pair Generation and Encryption with AES protection
import { encrypt as aesEncrypt, decrypt as aesDecrypt } from './Aes';

interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export const generateKeyPair = async (): Promise<KeyPair> => {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));
    const privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)));

    // Encrypt private key with AES before returning
    const encryptedPrivateKey = await aesEncrypt(`pk_${privateKey}`);

    return {
      privateKey: encryptedPrivateKey,
      publicKey: `pub_${publicKey}`
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw error;
  }
};

const importPublicKey = async (base64Key: string): Promise<CryptoKey> => {
  const keyString = base64Key.startsWith('pub_') ? base64Key.slice(4) : base64Key;
  const keyBuffer = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  
  return await window.crypto.subtle.importKey(
    "spki",
    keyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"]
  );
};

const importPrivateKey = async (base64Key: string): Promise<CryptoKey> => {
  const keyString = base64Key.startsWith('pk_') ? base64Key.slice(3) : base64Key;
  const keyBuffer = Uint8Array.from(atob(keyString), c => c.charCodeAt(0));
  
  return await window.crypto.subtle.importKey(
    "pkcs8",
    keyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
};

export const encryptData = async (data: string, publicKey: string): Promise<string> => {
  if (!publicKey || typeof publicKey !== 'string') {
    throw new Error('Invalid public key provided');
  }
  
  const key = await importPublicKey(publicKey);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    dataBuffer
  );
  
  const encryptedArray = new Uint8Array(encryptedBuffer);
  return btoa(String.fromCharCode(...encryptedArray));
};

export const decryptData = async (encryptedData: string, encryptedPrivateKey: string): Promise<string> => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    throw new Error('Invalid encrypted data provided');
  }
  
  if (!encryptedPrivateKey || typeof encryptedPrivateKey !== 'string') {
    throw new Error('Invalid private key provided');
  }
  
  try {
    // First decrypt the private key using AES
    const decryptedPrivateKey = await aesDecrypt(encryptedPrivateKey);
    
    // Then use the decrypted private key to decrypt the data
    const key = await importPrivateKey(decryptedPrivateKey);
    const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      key,
      encryptedArray
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Helper functions for objects
export const encryptObject = async (obj: any, publicKey: string): Promise<string> => {
  const jsonString = JSON.stringify(obj);
  return await encryptData(jsonString, publicKey);
};

export const decryptObject = async (encryptedData: string, privateKey: string): Promise<any> => {
  const jsonString = await decryptData(encryptedData, privateKey);
  return JSON.parse(jsonString);
};
