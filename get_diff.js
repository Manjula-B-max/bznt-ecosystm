import { exec } from 'child_process';
import fs from 'fs';

exec('git diff client/app.js', (err, stdout) => {
    fs.writeFileSync('diff_utf8.txt', stdout, 'utf8');
});
