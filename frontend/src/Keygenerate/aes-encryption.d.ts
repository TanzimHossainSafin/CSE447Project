declare module 'aes-encryption' {
  const AesEncryption: {
    new(): {
      setSecretKey(key: string): void;
      encrypt(plainText: string): string;
      decrypt(encrypted: string): string;
    };
  };
  export default AesEncryption;
}
