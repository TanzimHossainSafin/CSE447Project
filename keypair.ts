import * as ed from '@noble/ed25519';
// If you're using single file, use global variable instead: `window.nobleEd25519`
const encryption = async () => {
  const privateKey = ed.utils.randomSecretKey();
  const message = Uint8Array.from([0xab, 0xbc, 0xcd, 0xde]);
  const publicKey = await ed.getPublicKey(privateKey);
  const signature = await ed.sign(message, privateKey);
  const isValid = await ed.verify(signature, message, publicKey);
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  return { privateKey, publicKey, signature };
}
encryption();
