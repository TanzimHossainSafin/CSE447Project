import crypto from 'crypto';

export const generateKeyPair = async () => {
  // Generate RSA key pair using Node.js crypto
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  // Clean the keys by removing headers and formatting
  const cleanPrivateKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----\n/, '')
    .replace(/\n-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');

  const cleanPublicKey = publicKey
    .replace(/-----BEGIN PUBLIC KEY-----\n/, '')
    .replace(/\n-----END PUBLIC KEY-----/, '')
    .replace(/\n/g, '');

  return {
    privateKey: cleanPrivateKey,
    publicKey: cleanPublicKey
  };
}
