const Database = require('better-sqlite3');
const db = new Database('/var/www/service/wisatakaur.com/database');
db.prepare("UPDATE settings SET musicUrl = ? WHERE id = 1").run("https://wisatakaur.com/musik-undangan.mp3");
console.log("Music URL updated to https://wisatakaur.com/musik-undangan.mp3");
db.close();
