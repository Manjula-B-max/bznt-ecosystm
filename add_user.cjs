const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'server', 'bezent.db');

const email = process.argv[2];

if (!email) {
    console.error('❌ Error: No email provided.');
    console.error('Usage: node add_user.js newperson@example.com');
    process.exit(1);
}

try {
    const db = new Database(dbPath);
    
    // Check if it already exists to avoid throwing unique constraint errors blindly
    const exists = db.prepare('SELECT 1 FROM allowed_emails WHERE email = ?').get(email);
    
    if (exists) {
        console.log(`✅ ${email} is already in the allowed list.`);
        process.exit(0);
    }
    
    db.prepare('INSERT INTO allowed_emails (email) VALUES (?)').run(email);
    console.log(`🎉 Successfully authorized ${email} to log in to BEZENT!`);
    
} catch (e) {
    console.error('❌ Database Error:', e.message);
    process.exit(1);
}
