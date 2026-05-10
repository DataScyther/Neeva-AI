const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function removeWhiteBackground() {
  const image = await loadImage('public/neeva-logo.jpg');
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(image, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // The threshold for considering a pixel "white"
  const threshold = 240;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i+1];
    const b = data[i+2];
    
    // If the pixel is close to white, make it transparent
    if (r > threshold && g > threshold && b > threshold) {
      // Create a smooth alpha falloff based on how close to white it is
      const avg = (r + g + b) / 3;
      const alpha = Math.max(0, 255 - ((avg - threshold) * (255 / (255 - threshold))));
      
      // If it's very white, make it fully transparent
      if (avg > 250) {
         data[i+3] = 0;
      } else {
         // Anti-aliasing edge softening
         data[i+3] = Math.floor(alpha);
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('public/neeva-logo-transparent.png', buffer);
  console.log('Successfully created transparent logo!');
}

removeWhiteBackground().catch(console.error);
