# AXROK Backend REST API Service

Dedicated Node.js + Express + TypeScript backend service for the **AXROK Cybersecurity Publication Platform**.

---

## 🚀 Independent Deployment Options

This backend is completely decoupled from the Next.js frontend and can be deployed to any Node.js hosting platform:

### Option 1: Render (Recommended Free/Starter)
1. Push this folder to a GitHub repository (e.g. `axrok-backend`).
2. Log into [Render.com](https://render.com) and click **New > Web Service**.
3. Select your repository.
4. Settings:
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT=5000` (or leave default for Render `$PORT`)
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_strong_jwt_secret`
   - `CLIENT_URL=https://your-axrok-frontend.vercel.app`
   - `CLOUDINARY_CLOUD_NAME=your_cloudinary_name`
   - `CLOUDINARY_API_KEY=your_cloudinary_key`
   - `CLOUDINARY_API_SECRET=your_cloudinary_secret`

### Option 2: Railway
1. Click **New Project > Deploy from GitHub repo**.
2. Railway detects the `Dockerfile` or `package.json` automatically.
3. Configure the environment variables in Railway settings.

### Option 3: Docker / VPS
```bash
docker build -t axrok-backend .
docker run -p 5000:5000 --env-file .env axrok-backend
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server with live reload (Port 5000)
npm run dev

# Compile for production
npm run build

# Start production server
npm start
```

---

## 📡 Key Endpoints

- `GET /api/health` — Service health check & uptime status
- `POST /api/auth/login` — Admin authentication & JWT token generation
- `POST /api/auth/logout` — Admin session destruction
- `GET /api/posts` — Search, filter, and paginate cybersecurity dossiers
- `POST /api/media/upload` — Multer file upload with Cloudinary / local fallback
- `POST /api/newsletter/subscribe` — Newsletter subscription handler
