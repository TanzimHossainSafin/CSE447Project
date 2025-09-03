# Frontend Key Management System

এই প্রজেক্টে public key এবং private key localStorage এ store করার জন্য একটি complete system তৈরি করা হয়েছে।

## Features

### 1. Storage Utility (`src/utils/storage.ts`)
- `storePublicKey(publicKey)`: Public key localStorage এ store করে
- `storePrivateKey(privateKey)`: Private key localStorage এ store করে
- `getPublicKey()`: localStorage থেকে public key retrieve করে
- `getPrivateKey()`: localStorage থেকে private key retrieve করে
- `clearKeys()`: সব keys localStorage থেকে মুছে ফেলে
- `hasPublicKey()`: Public key আছে কিনা check করে
- `hasPrivateKey()`: Private key আছে কিনা check করে

### 2. Signup Component (`src/components/signup.tsx`)
- User registration form
- Registration এর পর automatically key pair generate করে
- Generated keys localStorage এ store করে

### 3. Key Display Component (`src/components/KeyDisplay.tsx`)
- localStorage থেকে keys display করে
- Copy to clipboard functionality
- Private key hide/show option
- Clear all keys functionality

## Usage

### Registration Process
1. Signup form fill করুন
2. Register button click করুন
3. Backend এ user create হবে
4. Key pair generate হবে
5. Keys automatically localStorage এ store হবে

### Viewing Stored Keys
1. KeyDisplay component automatically localStorage থেকে keys load করে
2. Public key always visible থাকে
3. Private key hide/show button দিয়ে control করা যায়
4. Copy buttons দিয়ে keys copy করা যায়

### Clearing Keys
- "Clear All Keys" button click করে সব keys মুছে ফেলা যায়

## API Endpoints Used

- `POST /register`: User registration
- `POST /keygen`: Key pair generation (requires authentication)

## Security Notes

⚠️ **Important**: 
- Private key localStorage এ store করা security risk হতে পারে
- Production environment এ private key secure storage (like encrypted storage) ব্যবহার করা উচিত
- এই demo শুধু development purpose এর জন্য

## Local Storage Keys

- `user_public_key`: Public key storage
- `user_private_key`: Private key storage  
- `user_token`: JWT token storage

## Development

```bash
# Frontend start করতে
cd frontend
npm run dev

# Backend start করতে (root directory থেকে)
npm run dev
```
