const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');

console.log('⚡ Building VESPER for Cloudflare Workers Static Assets...');

// Clean dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy vendor dependencies
const vendorDir = path.join(distDir, 'vendor');
fs.mkdirSync(vendorDir, { recursive: true });

const threeSrc = path.join(rootDir, 'node_modules', 'three', 'build', 'three.module.js');
if (fs.existsSync(threeSrc)) {
  fs.copyFileSync(threeSrc, path.join(vendorDir, 'three.module.js'));
  console.log('✔ Copied Three.js ES module to dist/vendor/three.module.js');
} else {
  console.error('✖ Three.js not found in node_modules! Run npm install first.');
  process.exit(1);
}

// Recursive copy function
function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  for (const item of fs.readdirSync(src)) {
    if (exclude.includes(item)) continue;
    const s = path.join(src, item);
    const d = path.join(dest, item);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d, exclude);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// Copy game source (exclude worker.js from static web root)
copyDir(srcDir, path.join(distDir, 'src'), ['worker.js']);
console.log('✔ Copied game systems and assets to dist/src');

// Copy and update index.html
const indexSrc = path.join(rootDir, 'index.html');
let indexHtml = fs.readFileSync(indexSrc, 'utf8');

// Replace node_modules path with vendor path for Three.js
indexHtml = indexHtml.replace(
  '"three": "./node_modules/three/build/three.module.js"',
  '"three": "./vendor/three.module.js"'
);

fs.writeFileSync(path.join(distDir, 'index.html'), indexHtml);
console.log('✔ Transformed and copied index.html to dist/index.html');

console.log('🎉 Build complete! Ready to deploy from ./dist');
