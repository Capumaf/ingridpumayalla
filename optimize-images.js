const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "./public";
const outputDir = "./public/optimized";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const files = fs.readdirSync(inputDir);

files.forEach(async (file) => {
  if (!file.endsWith(".webp")) return;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  try {
    await sharp(inputPath)
      .resize({
        width: 1600,
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toFile(outputPath);

    console.log(`✅ ${file} optimizado`);
  } catch (err) {
    console.error(`❌ error en ${file}`, err);
  }
});