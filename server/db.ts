import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../database.db');
const db = new Database(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS guests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    phone TEXT,
    slug TEXT UNIQUE NOT NULL,
    createdAt INTEGER DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    eventName TEXT,
    theme TEXT,
    dates TEXT,
    location TEXT,
    locationUrl TEXT,
    logoUrl TEXT,
    bannerUrl TEXT,
    heroLogoUrl TEXT,
    musicUrl TEXT,
    galleryImages TEXT
  );

  INSERT OR IGNORE INTO settings (id, eventName, theme, dates, location, locationUrl, logoUrl, bannerUrl, heroLogoUrl, musicUrl, galleryImages)
  VALUES (1, 'FESTIVAL GURITA 2026', 'Sambal Langat Gurita', '22 – 23 Mei 2026', 'Lapangan Merdeka Bintuhan', '', '', '', '', '', '[]');
`);

export default db;
