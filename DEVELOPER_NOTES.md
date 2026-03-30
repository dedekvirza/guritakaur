# Developer Notes: Database Migration & VPS Deployment

## Overview
The current application is built as a React (Vite) Single Page Application (SPA) using **Firebase** for Authentication and **Firestore** as the database. The owner intends to migrate the guest data from Firestore to **SQLite** and deploy the application on a **VPS**.

## Migration Requirements
1. **Backend Implementation**: 
   - Since SQLite is a file-based database that runs on the server, a backend (e.g., Express.js/Node.js) must be implemented to handle database operations.
   - The current frontend logic in `src/App.tsx` (using `onSnapshot`, `addDoc`, `deleteDoc`) needs to be replaced with API calls to the new backend.

2. **Database Schema (SQLite)**:
   - **Table: `guests`**
     - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
     - `name`: TEXT NOT NULL
     - `title`: TEXT
     - `phone`: TEXT
     - `slug`: TEXT UNIQUE NOT NULL
     - `createdAt`: INTEGER (Unix Timestamp)
   - **Table: `settings`**
     - `id`: INTEGER PRIMARY KEY CHECK (id = 1)
     - `eventName`: TEXT
     - `theme`: TEXT
     - `dates`: TEXT
     - `location`: TEXT
     - `locationUrl`: TEXT
     - `logoUrl`: TEXT
     - `bannerUrl`: TEXT
     - `heroLogoUrl`: TEXT
     - `musicUrl`: TEXT
     - `galleryImages`: TEXT (JSON serialized array)

3. **Authentication**:
   - The current system uses Firebase Auth. If migrating to a VPS without Firebase, a custom JWT-based authentication or a session-based system should be implemented to protect the `/admin` routes.
   - Current admin credentials: 
     - Username: `guritakaur`
     - Password: `sukses`

4. **Deployment on VPS**:
   - Use a process manager like **PM2** to keep the Node.js server running.
   - Use **Nginx** as a reverse proxy to serve the frontend and route `/api` requests to the backend.
   - Ensure the SQLite database file (`.db`) has appropriate read/write permissions for the web server user.

## Current Key Files
- `src/App.tsx`: Contains all frontend logic and Firestore queries.
- `src/firebase.ts`: Firebase initialization.
- `firestore.rules`: Current security logic (to be replicated in backend middleware).
