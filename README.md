# AI Customer Testimonial Request Generator

A full-stack application for generating personalized customer testimonial requests for Manivtha Tours & Travels.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Chart.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API

## Local Development Setup

### 1. Backend Setup
1. Open the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file from the template: `cp .env.example .env`
4. Add your **Gemini API Key** and **Firebase Admin Credentials** to the `.env` file.
   - For Firebase, go to Project Settings -> Service Accounts -> Generate new private key in your Firebase Console. Copy the details into the `.env` file.
5. Start the backend development server: `npm run dev`

### 2. Frontend Setup
1. Open the `frontend` directory in a new terminal: `cd frontend`
2. Install dependencies: `npm install`
3. Start the frontend development server: `npm run dev`

---

## Deployment Instructions

### 1. Deploying the Backend (Render)
1. Push your code to a GitHub repository.
2. Go to [Render.com](https://render.com/) and create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Under "Environment Variables", add all the keys from your local backend `.env` file. (For the private key, you can enter the entire string including newlines).
8. Click **Create Web Service**.
9. Once deployed, copy the Render URL (e.g., `https://ai-testimonial-backend.onrender.com`).

### 2. Deploying the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and create a new Project.
2. Import the same GitHub repository.
3. Edit the **Root Directory** and select `frontend`.
4. Framework Preset should auto-detect as `Vite`.
5. Under Environment Variables, add:
   - `VITE_API_URL`: Paste the Render backend URL you copied earlier, appending `/api` (e.g., `https://ai-testimonial-backend.onrender.com/api`).
6. Click **Deploy**.

## Environment Variables Reference

**Backend (`backend/.env`)**
```env
PORT=5001
FRONTEND_URL=your_vercel_url_here
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL=http://localhost:5001/api # Local
# Or your production URL
```
