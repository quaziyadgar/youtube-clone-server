# YouTube Clone Backend

This is the backend for a YouTube clone application, built with **Node.js**, **Express**, and **MongoDB Atlas**. It follows an MVC architecture, handling video uploads (using MongoDB GridFS for video file storage), user authentication, channel management, and video interactions (likes, comments, views). The backend provides APIs consumed by a React frontend.

## Features
- **Video Management**: Upload, stream, update, and delete videos with GridFS storage.
- **Authentication**: User registration and login with JWT-based authentication.
- **Channel Management**: Create and manage channels with associated videos.
- **Interactions**: Like, dislike, and comment on videos.
- **Search**: Filter videos by title or description.
- **Storage**: Stores video files directly in MongoDB Atlas using GridFS.

## Tech Stack
- **Node.js**: Runtime environment.
- **Express**: Web framework for API routing.
- **MongoDB Atlas**: Cloud database for data and video storage.
- **Mongoose**: ODM for MongoDB schema management.
- **Multer & GridFS**: Handles video file uploads and storage.
- **JWT & Bcrypt**: Authentication and password hashing.
- **UUID**: Generates unique IDs for videos and comments.

## Prerequisites
- **Node.js**: Version 16 or higher.
- **MongoDB Atlas**: Account with a cluster set up.
- **Git**: For cloning the repository.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/quaziyadgar/youtube-clone-server.git
   cd youtube-clone-server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory:
     ```plaintext
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ufyssf6.mongodb.net/youtube-clone?retryWrites=true&w=majority
     JWT_SECRET=your_secret_key
     PORT=5000
     ```
   - Replace `<username>`, `<password>`, and `cluster0.ufyssf6.mongodb.net` with your MongoDB Atlas credentials.
   - Ensure your IP (or `0.0.0.0/0` for testing) is whitelisted in MongoDB Atlas (**Network Access**).

4. **Seed the Database** (Optional):
   - Populate the database with dummy videos and channels:
     ```bash
     node seedDatabase.js
     ```

## Running the Server
- **Development** (with nodemon):
  ```bash
  npm run dev
  ```
- **Production**:
  ```bash
  npm start
  ```
- The server runs on `http://localhost:5000` (or the specified `PORT`).

## API Endpoints
### Authentication
- `POST /api/auth/register`: Register a new user.
  - Body: `{ "username": "string", "email": "string", "password": "string" }`
- `POST /api/auth/login`: Log in and receive a JWT token.
  - Body: `{ "email": "string", "password": "string" }`

### Videos
- `GET /api/videos`: Fetch all videos.
- `GET /api/videos/:videoId`: Fetch a single video by ID.
- `POST /api/videos`: Upload a new video (requires JWT).
  - Form-data: `title`, `description`, `channelId`, `video` (file).
- `PUT /api/videos/:videoId`: Update video details (requires JWT).
  - Body: `{ "title": "string", "description": "string", "likes": number, "dislikes": number }`
- `DELETE /api/videos/:videoId`: Delete a video (requires JWT).
- `POST /api/videos/:videoId/comments`: Add a comment to a video (requires JWT).
  - Body: `{ "text": "string" }`
- `GET /api/videos/:videoId/stream`: Stream a video file.

### Channels
- `GET /api/channels/:channelId`: Fetch a channel and its videos.
- `POST /api/channels`: Create a new channel (requires JWT).
  - Body: `{ "name": "string" }`

## Scripts
- `npm run dev`: Start the server with nodemon for development.
- `npm start`: Start the server for production.
- `node seedDatabase.js`: Seed the database with dummy data.

## Folder Structure
```
youtube-clone-server/
├── controllers/        # API logic (videoController.js, authController.js, etc.)
├── middleware/         # Authentication middleware (authMiddleware.js)
├── models/             # Mongoose schemas (Video.js, User.js, Channel.js)
├── routes/             # Express routes (videos.js, auth.js, channels.js)
├── utils/              # Utility functions (gridfs.js for video storage)
├── .env                # Environment variables (not committed)
├── index.js            # Server entry point
├── package.json        # Dependencies and scripts
├── seedDatabase.js     # Database seeding script
├── README.md           # This file
```

## Deployment
The backend is deployed to Vercel for serverless hosting:
1. Push the code to a GitHub repository.
2. Create a Vercel project and link the repository.
3. Set environment variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Deploy to get a public URL (e.g., `https://your-vercel-app.vercel.app`).
5. Update the frontend to use the Vercel URL for API requests.

See [Deployment](#deployment) for detailed steps.

## Troubleshooting
- **MongoDB Connection Issues**:
  - Verify `MONGODB_URI` format and credentials.
  - Ensure your IP is whitelisted in MongoDB Atlas (**Network Access**).
- **Video Upload Fails**:
  - Check `multer` and GridFS setup in `videoController.js`.
  - Test with small MP4 files (<10MB) to avoid timeouts.
- **API Errors**:
  - Check server logs for detailed error messages.
  - Ensure JWT tokens are valid for protected routes.

## License
MIT License. See LICENSE for details.

## Contact
For issues, open a GitHub issue or contact [your-email@example.com].


- **Save**: Place `README.md` in `server/` (e.g., `youtube-clone-server/README.md`).
- **Customize**:
  - Replace `your-username`, `your-email@example.com`, and `cluster0.ufyssf6.mongodb.net` with your actual details.
  - Update repository URL if different.
  - If you add features (e.g., thumbnails, subscriptions), update the **Features** section.

---

### Step 2: Deploy Backend to Vercel

Vercel supports Node.js/Express backends as serverless functions, ideal for your APIs (`/api/videos`, `/api/auth`, `/api/channels`) and GridFS video streaming. We’ll deploy the `server/` directory, configure environment variables, and ensure MongoDB Atlas connectivity.

#### 2.1 Prepare Backend for Vercel

Vercel requires a `vercel.json` configuration and minor tweaks to make your backend serverless-compatible.

1. **Create vercel.json**:
   This tells Vercel how to build and route requests.

   ```json{
     "version": 2,
     "builds": [
       {
         "src": "index.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "index.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

   - **Save**: Place in `server/vercel.json`.
   - **Purpose**:
     - `builds`: Uses Vercel’s Node.js builder for `index.js`.
     - `routes`: Sends all requests to `index.js` (your Express app).
     - `env`: Ensures production mode.

2. **Update package.json**:
   Ensure scripts and dependencies support Vercel.

   ```json{
     "name": "youtube-clone-server",
     "version": "1.0.0",
     "type": "module",
     "scripts": {
       "start": "node index.js",
       "dev": "nodemon index.js"
     },
     "dependencies": {
       "express": "^4.18.2",
       "mongoose": "^7.6.3",
       "multer": "^1.4.5-lts.1",
       "cors": "^2.8.5",
       "jsonwebtoken": "^9.0.2",
       "bcrypt": "^5.1.1",
       "dotenv": "^16.3.1",
       "uuid": "^9.0.1"
     },
     "devDependencies": {
       "nodemon": "^3.0.1"
     }
   }
   ```

   - **Save**: Replace `server/package.json`.
   - **Changes**:
     - Added `"start": "node index.js"` for Vercel’s production environment.
     - Ensured `type: "module"` for ES modules.
     - Included `multer` for video uploads and `mongoose` for GridFS.

3. **Update index.js**:
   Make it serverless-friendly by exporting the Express app.

   ```javascriptimport express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import videoRoutes from './routes/videos.js';
import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import dotenv from 'dotenv';
import { initGridFS } from './utils/gridfs.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Atlas connected');
    initGridFS();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Vercel serverless doesn't need app.listen
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
```

   - **Changes**:
     - Commented out `app.listen` (Vercel handles the server).
     - Added `export default app` for serverless functions.

4. **Ensure .gitignore**:
   Prevent sensitive files from being pushed.

   ```plainnode_modules/
.env
```

   - **Save**: Place in `server/.gitignore`.

#### 2.2 Set Up GitHub Repository

Vercel deploys from GitHub, so you need a repo for `server/`.

1. **Initialize Git**:
   ```bash
   cd server
   git init
   git add .
   git commit -m "Initial backend setup for YouTube clone"
   ```

2. **Create GitHub Repository**:
   - Go to [github.com](https://github.com).
   - Create a new repository (e.g., `youtube-clone-server`).
   - Set it to **Public** or **Private** as preferred.

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/your-username/youtube-clone-server.git
   git branch -M main
   git push -u origin main
   ```

   - Replace `your-username` with your GitHub username.

#### 2.3 Deploy to Vercel

1. **Sign Up/Log In to Vercel**:
   - Go to [vercel.com](https://vercel.com).
   - Sign up or log in (use GitHub for ease).

2. **Create a New Project**:
   - Click **New Project** > **Import Git Repository**.
   - Select `youtube-clone-server` from your GitHub account.
   - Grant Vercel access to the repo if prompted.

3. **Configure Project**:
   - **Framework Preset**: Select **Other** (since it’s a Node.js backend).
   - **Root Directory**: Leave as `./` (Vercel uses `server/` content).
   - **Build Command**: Leave default (`npm install` and run `index.js` via `vercel.json`).
   - **Output Directory**: Leave default.
   - **Environment Variables**:
     - Add:
       ```
       MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ufyssf6.mongodb.net/youtube-clone?retryWrites=true&w=majority
       JWT_SECRET=your_secret_key
       ```
     - Replace `<username>`, `<password>`, and cluster hostname with your MongoDB Atlas details.
     - Use the same `JWT_SECRET` as in `server/.env`.

4. **MongoDB Atlas Network Access**:
   - Since Vercel’s servers use dynamic IPs, whitelist all IPs:
     - Go to MongoDB Atlas > **Network Access**.
     - Add IP: `0.0.0.0/0` (Allow access from anywhere).
     - **Note**: This is okay for testing. For production, consider a VPC or proxy for security.

5. **Deploy**:
   - Click **Deploy**.
   - Vercel builds and deploys, providing a URL (e.g., `https://youtube-clone-server-xyz.vercel.app`).

6. **Test APIs**:
   - Use curl or Postman:
     ```bash
     curl https://your-vercel-app.vercel.app/api/videos
     ```
     - Expect: List of videos (e.g., from `seedDatabase.js`).
   - Test video streaming:
     ```bash
     curl https://your-vercel-app.vercel.app/api/videos/vid-001/stream
     ```
   - Register a user:
     ```bash
     curl -X POST https://your-vercel-app.vercel.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
     ```

#### 2.4 Update Frontend to Use Vercel URL

Your frontend (in `client/`) is likely local (`http://localhost:5173`). Update it to use the Vercel backend.

- **File**: `client/src/store/videoSlice.js`
  Replace `http://localhost:5000` with your Vercel URL:


- **Test Locally**:
  ```bash
  cd client
  npm run dev
  ```
  - Verify **Home Page** (`http://localhost:5173`) loads videos from Vercel.
  - Upload a video on **Channel Page** (`http://localhost:5173/channel`).
  - Play a video on **Video Player Page** (`http://localhost:5173/video/vid-xxx`).

---

### Why This Works
- **README**:
  - Clearly documents setup, APIs, and troubleshooting.
  - Aligns with your backend (GridFS, MVC, JWT, MongoDB Atlas).
  - Helps collaborators or evaluators understand the project (per PDF requirements).
- **Vercel Deployment**:
  - Hosts APIs serverlessly, supporting `/api/videos` (including streaming).
  - Integrates with MongoDB Atlas via `MONGODB_URI`.
  - Scales for video uploads and playback.
- **Project Context**:
  - Builds on video upload (GridFS), fixed **Home Page** error, and prior fixes (`createVideo`, IP whitelisting).
  - Supports **Home Page** (40 marks), **Channel Page** (40 marks), **Video Player** (50 marks).
- **Frontend Compatibility**:
  - Vercel URL replaces `localhost:5000`, enabling local frontend testing.

---

### Notes
- **Security**:
  - `0.0.0.0/0` in MongoDB Atlas is temporary. For production, use a proxy or Vercel’s VPC integration.
  - Store `JWT_SECRET` securely; don’t commit `.env`.
- **Frontend Deployment**:
  - If you want to deploy `client/` to Vercel, I can guide you (it’s simpler, as Vite is Vercel-friendly).
- **Video Streaming**:
  - GridFS works for small videos (<50MB). For larger files, consider AWS S3 or Cloudinary post-submission.
- **GitHub**:
  - If you don’t have a repo, let me know—I can adjust for local deployment or another platform (e.g., Render).

---

### Next Steps
1. **Apply README**:
   - Save `README.md` in `server/`.
   - Update placeholders (username, email, cluster).
2. **Deploy to Vercel**:
   - Follow Step 2: Push to GitHub, create Vercel project, set environment variables.
   - Share the Vercel URL to verify APIs.
3. **Update Frontend**:
   - Change `videoSlice.js` to use Vercel URL.
   - Test locally (`npm run dev`).
4. **Feedback**:
   - Did the deployment work? Test `/api/videos` and video streaming.
   - Need frontend deployment to Vercel?
   - Want to add **Subscriptions**, create a demo video, or finalize PDF requirements?
   - Any issues with video uploads or APIs?

Please share your Vercel URL or any errors, and I’ll assist further! What’s next?