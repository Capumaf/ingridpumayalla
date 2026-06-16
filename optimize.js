const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = './public';
const tmpDir = './public/_opt_tmp';

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

(async () => {
  for (const file of files) {
    const src = path.join(dir, file);
    const tmp = path.join(tmpDir, file);
    try {
      await sharp(src)
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(tmp);
      fs.copyFileSync(tmp, src);
      fs.unlinkSync(tmp);
      console.log('OK:', file);
    } catch (e) {
      console.error('SKIP:', file, e.message);
    }
  }
  fs.rmdirSync(tmpDir);
  console.log('Done -', files.length, 'images');
})();