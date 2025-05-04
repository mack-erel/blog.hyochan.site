import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCurrentDateTime() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const HH = pad(now.getHours());
    const ii = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${yyyy}-${mm}-${dd} ${HH}:${ii}:${ss}`;
}

let main = () => {
    const template = `---\nuid: ${uuidv4()}\ntitle: \ndescription: \ndate: ${getCurrentDateTime()}\ncategory: \n  - \ntags: \n  - \nthumbnail: \n---\n`;

    const outDir = path.join(__dirname, 'src', 'posts');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, 'new-article.md');
    fs.writeFileSync(outPath, template, 'utf8');
    console.log(`생성 완료: ${outPath}`);
};

main();