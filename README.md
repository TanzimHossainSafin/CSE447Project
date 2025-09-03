# CSE447 Project - Health & Habit Tracking Platform

A full-stack TypeScript application for tracking health habits and activities with blockchain integration. Built as part of CSE447 coursework.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Habit Management**: Create, track, and delete personal habits
- **Activity Tracking**: Monitor and manage daily activities
- **Blockchain Integration**: Crypto wallet connectivity using Wagmi and Viem
- **Real-time Data**: React Query for efficient data fetching and caching
- **Modern UI**: Responsive design with TailwindCSS

## 🛠️ Technologies Used

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **Prisma ORM** - Database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Query (@tanstack/react-query)** - Data fetching
- **React Router DOM** - Client-side routing
- **Wagmi & Viem** - Blockchain/Web3 integration
- **Axios** - HTTP client

## 📁 Project Structure

```
CSE447Project/
├── backend/
│   ├── controller/          # API route handlers
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── addHabit.ts
│   │   ├── deleteHabit.ts
│   │   ├── getAllHabits.ts
│   │   └── getMyActivities.ts
│   ├── middleware/          # Express middleware
│   ├── router/              # API routes
│   │   ├── userRouter.ts
│   │   └── healthDetailsRouter.ts
│   ├── utils/               # Utility functions
│   │   ├── auth.ts
│   │   ├── hashing.ts
│   │   └── prisma.ts
│   ├── prisma/              # Database schema and migrations
│   │   └── schema.prisma
│   ├── index.ts             # Server entry point
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Main entities:

- **User**: User accounts with authentication
- **Habit**: Personal habits tracked by users
- **Activity**: Daily activities and their status

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TanzimHossainSafin/CSE447Project.git
   cd CSE447Project
   ```

2. **Backend Setup**
   ```bash
   # Install backend dependencies
   npm install
   
   # Set up environment variables
   cp .example.env .env
   # Edit .env with your database URL, JWT secret, and port
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://username:password@localhost:5432/cse447project"
   JWT_SECRET="your-super-secret-jwt-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   # From project root
   npm run dev
   ```
   The API server will start on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   # In a new terminal, from frontend directory
   cd frontend
   npm run dev
   ```
   The React app will start on `http://localhost:5173`

## 📚 API Endpoints

### Authentication
- `POST /app/v1/users/signup` - User registration
- `POST /app/v1/users/login` - User login

### Health & Habits (Protected Routes)
- `POST /app/v1/health/addhabit` - Add a new habit
- `DELETE /app/v1/health/delete` - Delete a habit
- `GET /app/v1/health/habits` - Get user's habits
- `GET /app/v1/health/allhabits` - Get all users' habits
- `GET /app/v1/health/myactivities` - Get user's activities

### Request/Response Examples

**User Registration:**
```json
POST /app/v1/users/signup
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "publicKey": "optional_crypto_wallet_public_key"
}
```

**Add Habit:**
```json
POST /app/v1/health/addhabit
Headers: { "Authorization": "Bearer <jwt_token>" }
{
  "name": "Daily Exercise",
  "description": "30 minutes of cardio every morning"
}
```

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Register or login to receive a JWT token
2. Include the token in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## 🌐 Blockchain Integration

The frontend includes Web3 functionality through:
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- Support for crypto wallet connections

## 🧪 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests (when implemented)

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Database Operations

```bash
# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Generate new migration
npx prisma migrate dev --name migration_name
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Tanzim Hossain Safin** - Initial work - [TanzimHossainSafin](https://github.com/TanzimHossainSafin)

## 🆘 Troubleshooting

**Common Issues:**

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Ensure database exists

2. **JWT Authentication Failed**
   - Verify JWT_SECRET is set in .env
   - Check token format in Authorization header

3. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **CORS Errors**
   - Ensure CORS is properly configured in backend
   - Check frontend API base URL configuration

---

For more information or support, please create an issue in the GitHub repository.