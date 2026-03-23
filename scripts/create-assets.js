const fs = require('fs');
const path = require('path');

// Minimal valid 1x1 transparent PNG (67 bytes)
const MINIMAL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
);

const assetsDir = path.join(__dirname, '..', 'assets');
if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const files = ['icon.png', 'splash-icon.png', 'adaptive-icon.png', 'favicon.png'];
files.forEach((f) => fs.writeFileSync(path.join(assetsDir, f), MINIMAL_PNG));
console.log('Assets criados:', files.join(', '));
