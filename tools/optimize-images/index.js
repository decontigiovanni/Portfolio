import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import sharp from "sharp";

const ROOT = new URL("../../", import.meta.url).pathname;

const PROJECTS = [
  {
    name: "brandmr",
    srcDir: join(ROOT, "Immagini", "Portfolio images", "01 BrandMR"),
    outDir: join(ROOT, "Immagini", "brandmr"),
    widths: [480, 960, 1440, 1920],
  },
  {
    name: "telefono-terminale",
    srcDir: join(ROOT, "Immagini", "Portfolio images", "02 Telefono Terminale"),
    outDir: join(ROOT, "Immagini", "telefono-terminale"),
    widths: [480, 960, 1241],
  },
];

// Frames that get a slightly higher quality budget (renders / product photos).
const HIGH_QUALITY_BASENAMES = new Set([
  "04-render-hero-fronte-retro",
  "05-exploded-render",
  "09-modello-fisico-in-mano",
  "10-uso-musica-e-qr",
  "11-uso-chiamata-e-assistente-vocale",
  "12-uso-cuffie-e-tasca",
  "13-ergonomia-grip-sequence",
]);

const QUALITY = {
  default: { webp: 82, avif: 55 },
  high: { webp: 88, avif: 62 },
};

const HEAVY_THRESHOLD_BYTES = 300 * 1024;

function middleWidth(widths) {
  return widths[Math.floor((widths.length - 1) / 2)];
}

async function processImage(project, file) {
  const base = basename(file, extname(file));
  const srcPath = join(project.srcDir, file);
  const quality = HIGH_QUALITY_BASENAMES.has(base) ? QUALITY.high : QUALITY.default;

  const srcImage = sharp(srcPath);
  const meta = await srcImage.metadata();
  const nativeWidth = meta.width;
  const nativeHeight = meta.height;

  const widths = project.widths.filter((w) => w <= nativeWidth);
  const fallbackWidth = middleWidth(widths);

  const generated = [];
  const heavy = [];

  for (const width of widths) {
    for (const [format, ext, opts] of [
      ["avif", "avif", { quality: quality.avif }],
      ["webp", "webp", { quality: quality.webp }],
    ]) {
      const outName = `${base}-${width}.${ext}`;
      const outPath = join(project.outDir, outName);
      await sharp(srcPath)
        .resize({ width, withoutEnlargement: true })
        [format](opts)
        .toFile(outPath);
      const { size } = await stat(outPath);
      generated.push({ file: outName, format, width, bytes: size });
      if (size > HEAVY_THRESHOLD_BYTES) heavy.push({ file: outName, bytes: size });
    }
  }

  // Single PNG fallback at the middle breakpoint.
  const fallbackName = `${base}-fallback.png`;
  const fallbackPath = join(project.outDir, fallbackName);
  await sharp(srcPath)
    .resize({ width: fallbackWidth, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(fallbackPath);
  const { size: fallbackSize } = await stat(fallbackPath);
  generated.push({ file: fallbackName, format: "png", width: fallbackWidth, bytes: fallbackSize });
  if (fallbackSize > HEAVY_THRESHOLD_BYTES) heavy.push({ file: fallbackName, bytes: fallbackSize });

  return {
    base,
    nativeWidth,
    nativeHeight,
    widths,
    fallbackWidth,
    highQuality: HIGH_QUALITY_BASENAMES.has(base),
    generated,
    heavy,
  };
}

async function run() {
  const manifest = {};
  const allHeavy = [];

  for (const project of PROJECTS) {
    await mkdir(project.outDir, { recursive: true });
    const files = (await readdir(project.srcDir)).filter((f) => f.toLowerCase().endsWith(".png"));
    files.sort();

    manifest[project.name] = [];
    console.log(`\n=== ${project.name} (${files.length} immagini) ===`);

    for (const file of files) {
      const result = await processImage(project, file);
      manifest[project.name].push(result);
      console.log(
        `  ${result.base}: nativo ${result.nativeWidth}x${result.nativeHeight}, breakpoint [${result.widths.join(", ")}]${
          result.highQuality ? " (qualità alta)" : ""
        }`
      );
      for (const h of result.heavy) {
        allHeavy.push({ project: project.name, ...h });
      }
    }
  }

  const manifestPath = join(ROOT, "Immagini", "gallery-manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest scritto in ${manifestPath}`);

  if (allHeavy.length) {
    console.log("\n⚠️  Immagini ancora sopra ~300KB dopo la conversione:");
    for (const h of allHeavy) {
      console.log(`  ${h.project}/${h.file} — ${(h.bytes / 1024).toFixed(0)}KB`);
    }
  } else {
    console.log("\nNessuna immagine sopra la soglia di 300KB.");
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
