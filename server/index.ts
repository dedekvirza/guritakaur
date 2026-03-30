import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-festival-gurita';

app.use(cors());
app.use(express.json());

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Auth Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH API ---
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Based on DEVELOPER_NOTES.md
  if (username === 'guritakaur' && password === 'sukses') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token, user: { username: 'Admin' } });
  }
  res.status(401).json({ message: 'Username atau password salah' });
});

// --- PUBLIC GUEST API ---
app.get('/api/public/guest/:slug', (req, res) => {
  const guest = db.prepare('SELECT * FROM guests WHERE slug = ?').get(req.params.slug);
  if (!guest) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
  res.json(guest);
});

app.get('/api/public/settings', (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (settings) {
    // Parse galleryImages from JSON string
    (settings as any).galleryImages = JSON.parse((settings as any).galleryImages || '[]');
  }
  res.json(settings);
});

// --- ADMIN GUEST API ---
app.get('/api/admin/guests', authenticateToken, (req, res) => {
  const guests = db.prepare('SELECT * FROM guests ORDER BY createdAt DESC').all();
  res.json(guests);
});

app.post('/api/admin/guests', authenticateToken, (req, res) => {
  const { name, title, phone, slug } = req.body;
  try {
    const info = db.prepare('INSERT INTO guests (name, title, phone, slug, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(name, title, phone, slug, Math.floor(Date.now() / 1000));
    res.json({ id: info.lastInsertRowid, name, title, phone, slug });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/admin/guests/:id', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// --- ADMIN SETTINGS API ---
app.get('/api/admin/settings', authenticateToken, (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
  if (settings) {
    (settings as any).galleryImages = JSON.parse((settings as any).galleryImages || '[]');
  }
  res.json(settings);
});

app.post('/api/admin/settings', authenticateToken, (req, res) => {
  const { eventName, theme, dates, location, locationUrl, logoUrl, bannerUrl, heroLogoUrl, musicUrl, galleryImages } = req.body;
  const galleryImagesJson = JSON.stringify(galleryImages || []);
  
  db.prepare(`
    UPDATE settings SET 
      eventName = ?, theme = ?, dates = ?, location = ?, locationUrl = ?, 
      logoUrl = ?, bannerUrl = ?, heroLogoUrl = ?, musicUrl = ?, galleryImages = ?
    WHERE id = 1
  `).run(eventName, theme, dates, location, locationUrl, logoUrl, bannerUrl, heroLogoUrl, musicUrl, galleryImagesJson);
  
  res.json({ success: true });
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
