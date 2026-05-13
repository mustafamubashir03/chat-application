# Chat Application

A full-stack real-time chat application built with React, TypeScript, Node.js, Express, Socket.io, and MongoDB. This application enables users to create workspaces, channels, and communicate in real-time with rich text messaging capabilities.

## 🚀 Features

### Core Features
- **User Authentication**: Secure signup and signin with JWT-based authentication
- **Email Verification**: Optional email verification system for new users
- **Workspace Management**: Create and manage multiple workspaces
- **Channel System**: Create channels within workspaces for organized communication
- **Real-time Messaging**: Instant messaging using Socket.io for real-time updates
- **Rich Text Editor**: Quill-based rich text editor with formatting options
- **Image Upload**: Support for image attachments via Cloudinary integration
- **Member Management**: Add members to workspaces with role-based access (admin/member)
- **Join Codes**: Workspace join codes for easy member invitation
- **Real-time Video Calling**: High-quality peer-to-peer video conferencing within workspaces

### Technical Features
- **Real-time Updates**: Live message delivery and channel updates
- **Queue System**: Bull/BullMQ for background job processing (email notifications)
- **Redis Integration**: Redis for queue management and caching
- **RESTful API**: Well-structured REST API endpoints
- **WebSocket Support**: Socket.io for bidirectional real-time communication
- **Responsive Design**: Modern UI built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **WebRTC Integration**: Seamless video and audio communication using PeerJS

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **React Query (TanStack Query)** - Server state management
- **Quill Editor** - Rich text editing
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Axios** - HTTP client
- **Zod** - Schema validation
- **PeerJS** - WebRTC peer-to-peer communication

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Bull/BullMQ** - Job queue management
- **Redis** - Queue backend and caching
- **Nodemailer** - Email service
- **Zod** - Schema validation
- **ExpressPeerServer** - PeerJS server for WebRTC signaling

### Infrastructure
- **MongoDB** - Primary database
- **Redis** - Queue backend
- **Cloudinary** - Image hosting (frontend integration)

## 📁 Project Structure

```
chat-application/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── auth/           # JWT authentication utilities
│   │   ├── config/         # Configuration files (DB, Redis, Mail, Server)
│   │   ├── controllers/   # Request handlers (REST + Socket)
│   │   ├── middlewares/    # Express middlewares (auth, validation)
│   │   ├── processors/     # Queue job processors
│   │   ├── producers/      # Queue job producers
│   │   ├── queues/         # Queue definitions
│   │   ├── repository/     # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── schema/         # Mongoose schemas
│   │   ├── services/       # Business logic layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                # Frontend React application
│   ├── src/
│   │   ├── apis/           # API client functions
│   │   ├── atoms/          # Atomic components
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # Configuration files
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Root component
│   │   ├── Routes.tsx      # Route definitions
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
└── common/                  # Shared package
    ├── src/
    │   └── index.ts        # Shared types and schemas
    └── package.json
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **pnpm** (package manager)
- **MongoDB** (local or cloud instance)
- **Redis** (for queue management)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-application
   ```

2. **Install dependencies for each package**

   Backend:
   ```bash
   cd backend
   npm install
   # or
   pnpm install
   ```

   Frontend:
   ```bash
   cd frontend
   npm install
   # or
   pnpm install
   ```

   Common (if needed):
   ```bash
   cd common
   npm install
   # or
   pnpm install
   ```

## ⚙️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DEV_DB_URL=mongodb://localhost:27017/chat-app
PROD_DB_URL=mongodb://your-production-mongodb-url

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=1d

# Application URL
APP_URL=http://localhost:3000

# Email Configuration (Optional)
ENABLE_EMAIL_VERIFICATION=false
MAIL_ID=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PORT=6379
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# PeerJS Configuration
VITE_PEERJS_HOST=localhost
VITE_PEERJS_PORT=3000
VITE_PEERJS_PATH=/peerjs
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Redis** (if running locally)
   ```bash
   redis-server
   ```

3. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   # or
   pnpm dev
   ```
   The backend will start on `http://localhost:3000`

4. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # or
   pnpm dev
   ```
   The frontend will start on `http://localhost:5173` (or the next available port)

### Production Build

**Backend:**
```bash
cd backend
npm run start
# or
pnpm start
```

**Frontend:**
```bash
cd frontend
npm run build
# or
pnpm build
```

The production build will be in `frontend/dist/`

## 📡 API Endpoints

### Authentication
- `POST /api/v1/user/signup` - Register a new user
- `POST /api/v1/user/signin` - Sign in existing user

### Workspaces
- `GET /api/v1/workspace` - Get all workspaces for authenticated user
- `POST /api/v1/workspace` - Create a new workspace
- `GET /api/v1/workspace/:id` - Get workspace details
- `PUT /api/v1/workspace/:id` - Update workspace
- `DELETE /api/v1/workspace/:id` - Delete workspace
- `POST /api/v1/workspace/:id/join` - Join workspace with join code
- `GET /api/v1/workspace/:id/members` - Get workspace members

### Channels
- `GET /api/v1/channel/workspace/:workspaceId` - Get all channels in workspace
- `POST /api/v1/channel` - Create a new channel
- `GET /api/v1/channel/:id` - Get channel details
- `PUT /api/v1/channel/:id` - Update channel
- `DELETE /api/v1/channel/:id` - Delete channel

### Messages
- `GET /api/v1/messages/channel/:channelId` - Get messages in a channel
- `POST /api/v1/messages` - Create a new message (REST fallback)

### Members
- `GET /api/v1/member/workspace/:workspaceId` - Get workspace members
- `POST /api/v1/member/workspace/:workspaceId` - Add member to workspace
- `DELETE /api/v1/member/:memberId` - Remove member from workspace

### Health Check
- `GET /health` - Server health check

### Email Verification
- `GET /verify/:token` - Verify user email

### Bull Board (Development)
- `GET /ui` - Bull queue dashboard (for monitoring jobs)

## 🔌 WebSocket Events

### Client → Server
- `newMessage` - Send a new message
  ```typescript
  {
    messageBody: string,
    image?: string,
    channelId: string,
    workspaceId: string,
    senderId: string
  }
  ```
- `joinChannel` - Join a channel room
- `leaveChannel` - Leave a channel room
- `createChannel` - Create a new channel
- `updateChannel` - Update channel details
- `deleteChannel` - Delete a channel
- `create-room` - Initialize a video call room
- `joined-room` - Join an existing video call room
- `ready` - Signal that the peer is ready for connections

### Server → Client
- `messageReceived` - New message broadcast
- `channelCreated` - Channel creation notification
- `channelUpdated` - Channel update notification
- `channelDeleted` - Channel deletion notification
- `user-joined` - Notification when a new peer joins the video call
- `user-left` - Notification when a peer leaves the video call
- `room-created` - Confirmation of video room creation

## 🏗️ Architecture

### Backend Architecture
- **MVC Pattern**: Controllers handle requests, Services contain business logic, Repositories handle data access
- **Queue System**: Bull/BullMQ for asynchronous job processing (emails)
- **Socket Handlers**: Separate controllers for Socket.io event handling
- **Middleware Chain**: Authentication and validation middlewares
- **Schema Validation**: Zod schemas for request validation

### Frontend Architecture
- **Component Hierarchy**: Atomic Design (atoms → molecules → organisms)
- **State Management**: React Context + React Query for server state
- **Real-time Updates**: Socket.io client integration
- **Routing**: React Router with protected routes
- **API Layer**: Axios-based API client with interceptors

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User signs up/signs in
2. Server generates JWT token
3. Token is stored in localStorage (frontend)
4. Token is sent in `Authorization` header for protected routes
5. Middleware validates token on each request

## 📝 Database Schema

### User
- `email` (unique, required)
- `username` (unique, required)
- `password` (hashed)
- `avatar` (auto-generated)
- `isVerified` (boolean)
- `verificationToken` (string)
- `verificationTokenExpiry` (number)

### Workspace
- `name` (unique, required)
- `description` (string)
- `members` (array of { memberId, role })
- `joinCode` (required)
- `channels` (array of channel IDs)

### Channel
- `name` (required)
- `workspaceId` (reference to Workspace)
- `createdAt`, `updatedAt` (timestamps)

### Message
- `messageBody` (required)
- `image` (optional)
- `channelId` (reference to Channel)
- `workspaceId` (reference to Workspace)
- `senderId` (reference to User)
- `createdAt`, `updatedAt` (timestamps)

## 🧪 Development

### Code Formatting
```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Linting
```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
```

## 📦 Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update `PROD_DB_URL` with production MongoDB URL
3. Set secure `JWT_SECRET`
4. Configure Redis URL for production
5. Deploy to your preferred hosting (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Update environment variables for production API URLs
2. Run `npm run build`
3. Deploy `dist/` folder to static hosting (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Mustafa Mubashir

## 🙏 Acknowledgments

- React Team
- Express.js Team
- Socket.io Team
- MongoDB Team
- All open-source contributors

---

**Note**: Make sure to update environment variables and secrets before deploying to production. Never commit `.env` files to version control.
