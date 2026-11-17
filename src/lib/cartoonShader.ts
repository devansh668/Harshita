import { TransformationStyle } from '@/types';

/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Performs high quality mathematical transformations on the actual photograph pixels,
 * preserving 100% of the subject's unique facial features, hairstyle, and identity.
 */
export async function applyArtisticTransformation(
  source: string | HTMLImageElement,
  style: TransformationStyle,
  options?: {
    sharpness?: number;
    inkStrength?: number;
    vibrance?: number;
  }
): Promise<string> {
  const img = typeof source === 'string' ? await loadImage(source) : source;

  const canvas = document.createElement('canvas');
  // Scale down if extremely large for smooth real-time processing while preserving high detail
  const maxDim = 1200;
  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  // Draw base image
  ctx.drawImage(img, 0, 0, width, height);

  switch (style) {
    case 'manhwa-webtoon':
      applyManhwaWebtoon(ctx, width, height, options);
      break;
    case 'pencil':
      applyPencilSketch(ctx, width, height);
      break;
    case 'watercolor':
      applyWatercolor(ctx, width, height);
      break;
    case 'cartoon-3d':
      apply3DCartoon(ctx, width, height);
      break;
    case 'anime':
      applyAnimeStyle(ctx, width, height);
      break;
    case 'disney':
      applyDisneyFairytale(ctx, width, height);
      break;
    case 'aesthetic-soft':
      applySoftAesthetic(ctx, width, height);
      break;
    case 'chibi':
      applyChibiStyle(ctx, width, height);
      break;
    case 'pro-enhance':
      applyProEnhance(ctx, width, height);
      break;
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

// ----------------------------------------------------------------------
// 0. MODERN ANIME / MANHWA (High-Definition Crystal-Clear Illustration)
// ----------------------------------------------------------------------
function applyManhwaWebtoon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  options?: {
    sharpness?: number;
    inkStrength?: number;
    vibrance?: number;
  }
) {
  const sharpness = options?.sharpness !== undefined ? options.sharpness : 0.75;
  const inkStrength = options?.inkStrength !== undefined ? options.inkStrength : 0.45;
  const vibrance = options?.vibrance !== undefined ? options.vibrance : 0.6;

  // 1. Create smoothed buffer for noise-free edge detection & base layer
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const bCtx = blurCanvas.getContext('2d')!;
  bCtx.filter = 'blur(2px)';
  bCtx.drawImage(ctx.canvas, 0, 0);

  const baseImgData = ctx.getImageData(0, 0, width, height);
  const blurImgData = bCtx.getImageData(0, 0, width, height);

  const baseData = baseImgData.data;
  const blurData = blurImgData.data;

  // 2. High-Definition Pixel Grading: Continuous S-curve, Unsharp Mask, Zero Blotchiness
  for (let i = 0; i < baseData.length; i += 4) {
    let r = baseData[i];
    let g = baseData[i + 1];
    let b = baseData[i + 2];

    const br = blurData[i];
    const bg = blurData[i + 1];
    const bb = blurData[i + 2];

    // High-pass Unsharp Mask for razor-sharp clarity
    r = r + (r - br) * sharpness;
    g = g + (g - bg) * sharpness;
    b = b + (b - bb) * sharpness;

    // Continuous S-Curve tone mapping for deep obsidian darks and clean highlights
    let nr = Math.max(0, Math.min(255, r)) / 255;
    let ng = Math.max(0, Math.min(255, g)) / 255;
    let nb = Math.max(0, Math.min(255, b)) / 255;

    const applySCurve = (val: number, amount: number) => {
      const curved = val < 0.5 ? 2 * val * val : 1 - 2 * (1 - val) * (1 - val);
      return val * (1 - amount) + curved * amount;
    };

    nr = applySCurve(nr, 0.45);
    ng = applySCurve(ng, 0.45);
    nb = applySCurve(nb, 0.45);

    r = nr * 255;
    g = ng * 255;
    b = nb * 255;

    // Vibrance boost (enhances rich colors without blowing out skin)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const sat = (maxVal - minVal) / (maxVal || 1);
    const vBoost = (1 - sat) * (vibrance * 0.45);

    const avg = (r + g + b) / 3;
    r = r + (r - avg) * (1 + vBoost);
    g = g + (g - avg) * (1 + vBoost);
    b = b + (b - avg) * (1 + vBoost);

    // Continuous Skin Luminance Smoothing (NO harsh binary checks = ZERO blotches!)
    const isWarmTone = r > 70 && g > 45 && b > 35 && r >= g && g >= b;
    const skinScore = isWarmTone ? Math.min(1, Math.max(0, (r - b) / 50)) : 0;

    if (skinScore > 0.05) {
      // Gentle peach radiance
      const targetR = r * 1.03 + 3;
      const targetG = g * 1.01 + 1;
      const targetB = b * 0.98;

      const blend = skinScore * 0.5;
      r = r * (1 - blend) + targetR * blend;
      g = g * (1 - blend) + targetG * blend;
      b = b * (1 - blend) + targetB * blend;
    }

    baseData[i] = Math.min(255, Math.max(0, r));
    baseData[i + 1] = Math.min(255, Math.max(0, g));
    baseData[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(baseImgData, 0, 0);

  // 3. Clean Noise-Free Structural Ink Contours
  // Edge detection is executed on the smoothed buffer to avoid speckles & noise on cheeks/rocks
  const lineCanvas = document.createElement('canvas');
  lineCanvas.width = width;
  lineCanvas.height = height;
  const lCtx = lineCanvas.getContext('2d')!;
  lCtx.drawImage(blurCanvas, 0, 0);

  applyAdaptiveInkLines(lCtx, width, height, 0.32);

  // Overlay clean dark ink lines
  ctx.save();
  ctx.globalAlpha = inkStrength;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(lineCanvas, 0, 0);
  ctx.restore();

  // 4. Specular Highlights Only (NO hazy white screen bloom!)
  const highlightCanvas = document.createElement('canvas');
  highlightCanvas.width = width;
  highlightCanvas.height = height;
  const hCtx = highlightCanvas.getContext('2d')!;
  hCtx.drawImage(ctx.canvas, 0, 0);

  const hData = hCtx.getImageData(0, 0, width, height);
  const hd = hData.data;
  for (let i = 0; i < hd.length; i += 4) {
    const lum = 0.299 * hd[i] + 0.587 * hd[i + 1] + 0.114 * hd[i + 2];
    if (lum > 225) {
      hd[i] = 255;
      hd[i + 1] = 255;
      hd[i + 2] = 255;
      hd[i + 3] = Math.min(255, (lum - 225) * 4);
    } else {
      hd[i + 3] = 0;
    }
  }
  hCtx.putImageData(hData, 0, 0);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.filter = 'blur(3px)';
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(highlightCanvas, 0, 0);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 1. PENCIL SKETCH (True Graphite & Charcoal Sketch on Paper)
// ----------------------------------------------------------------------
function applyPencilSketch(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Step 1: Grayscale + Invert into a second buffer
  const gray = new Uint8Array(width * height);
  const inverted = new Uint8Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    // Luminance formula
    const g = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    gray[p] = g;
    inverted[p] = 255 - g;
  }

  // Step 2: Fast Box Blur on inverted buffer (simulates Gaussian blur)
  const blurred = fastBlurGray(inverted, width, height, 5);

  // Step 3: Color Dodge Blend: result = (base * 256) / (255 - blend)
  for (let p = 0, i = 0; p < gray.length; p++, i += 4) {
    const base = gray[p];
    const blend = blurred[p];
    let val: number;
    if (blend >= 255) {
      val = 255;
    } else {
      val = Math.min(255, (base << 8) / (255 - blend));
    }

    // Enhance pencil dark lines
    if (val < 160) {
      val = Math.round(val * 0.75); // Deeper graphite strokes
    }

    // Soft warm paper tint
    data[i] = Math.min(255, val + 5); // R
    data[i + 1] = Math.min(255, val + 2); // G
    data[i + 2] = Math.max(0, val - 4); // B slightly warmer
    data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);

  // Step 4: Subtle paper texture overlay
  ctx.save();
  ctx.fillStyle = 'rgba(245, 238, 220, 0.08)';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 2. WATERCOLOR PAINTING (Fluid Bleed, Wet Edges, Pigment Granulation)
// ----------------------------------------------------------------------
function applyWatercolor(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Step 1: Color Quantization & Posterization to simulate watercolor washes
  const levels = 12;
  const step = 255 / levels;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Boost saturation first for vibrant pigment
    const avg = (r + g + b) / 3;
    r = avg + (r - avg) * 1.35;
    g = avg + (g - avg) * 1.35;
    b = avg + (b - avg) * 1.35;

    // Quantize
    r = Math.round(r / step) * step;
    g = Math.round(g / step) * step;
    b = Math.round(b / step) * step;

    // Subtle watercolor wash warmth
    data[i] = Math.min(255, Math.max(0, r + 4));
    data[i + 1] = Math.min(255, Math.max(0, g + 2));
    data[i + 2] = Math.min(255, Math.max(0, b - 2));
  }

  ctx.putImageData(imgData, 0, 0);

  // Step 2: Overlay soft diffuse bleed layer
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.filter = 'blur(6px)';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Step 3: Delicate sketch contour accents
  const contourCanvas = document.createElement('canvas');
  contourCanvas.width = width;
  contourCanvas.height = height;
  const cCtx = contourCanvas.getContext('2d')!;
  cCtx.drawImage(ctx.canvas, 0, 0);
  applySobelEdges(cCtx, width, height, 0.18);

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(contourCanvas, 0, 0);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 3. 3D CARTOON STYLE (Pixar/Dreamworks Clay & Studio Specular)
// ----------------------------------------------------------------------
function apply3DCartoon(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Smooth skin & color quantization
    const avg = (r + g + b) / 3;
    // Vibrance
    r = avg + (r - avg) * 1.28;
    g = avg + (g - avg) * 1.28;
    b = avg + (b - avg) * 1.28;

    // 3D Rim Light: Highlight tones boosted, shadows gently compressed
    if (r > 170) r = Math.min(255, r * 1.08);
    if (g > 170) g = Math.min(255, g * 1.08);
    if (b > 170) b = Math.min(255, b * 1.08);

    // Warm peach studio ambient
    r = r * 1.04 + 3;
    g = g * 1.01 + 1;
    b = b * 0.96;

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
  ctx.putImageData(imgData, 0, 0);

  // Soft porcelain bloom
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.filter = 'blur(4px) brightness(1.08) contrast(1.1)';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Subtle clean edge enhancement
  const edgeCanvas = document.createElement('canvas');
  edgeCanvas.width = width;
  edgeCanvas.height = height;
  const eCtx = edgeCanvas.getContext('2d')!;
  eCtx.drawImage(ctx.canvas, 0, 0);
  applySobelEdges(eCtx, width, height, 0.15);

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(edgeCanvas, 0, 0);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 4. CUTE ANIME STYLE (Clean Inking, Rosy Cheeks, Saturated Color)
// ----------------------------------------------------------------------
function applyAnimeStyle(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Anime high key brightness & saturation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    // Skin smoothing & pink undertones
    if (r > 130 && r > b) {
      r = Math.min(255, r * 1.1 + 8);
      g = Math.min(255, g * 1.02 + 2);
      b = Math.min(255, b * 1.05 + 6);
    } else {
      // Shadows deepened slightly for cel-shading feel
      r = r * 0.94;
      g = g * 0.94;
      b = b * 0.98;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
  ctx.putImageData(imgData, 0, 0);

  // Inked Line Art Overlay
  const lineCanvas = document.createElement('canvas');
  lineCanvas.width = width;
  lineCanvas.height = height;
  const lCtx = lineCanvas.getContext('2d')!;
  lCtx.drawImage(ctx.canvas, 0, 0);
  applySobelEdges(lCtx, width, height, 0.28);

  ctx.save();
  ctx.globalAlpha = 0.32;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(lineCanvas, 0, 0);
  ctx.restore();

  // Subtle pastel pink / lavender glow
  ctx.save();
  const grad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    width * 0.1,
    width * 0.5,
    height * 0.45,
    width * 0.7
  );
  grad.addColorStop(0, 'rgba(255, 220, 240, 0.12)');
  grad.addColorStop(1, 'rgba(230, 210, 255, 0.08)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 5. DISNEY FAIRYTALE AESTHETIC (Golden Glow, Stardust Highlights)
// ----------------------------------------------------------------------
function applyDisneyFairytale(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Base warmth and soft dream bloom
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.filter = 'blur(8px) brightness(1.15) saturate(1.35)';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Warm golden amber overlay
  ctx.save();
  ctx.globalAlpha = 0.16;
  ctx.fillStyle = '#FFB86C';
  ctx.globalCompositeOperation = 'color-burn';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Fairytale star sparkles on random bright spots
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  for (let y = 30; y < height - 30; y += 45) {
    for (let x = 30; x < width - 30; x += 45) {
      const idx = (y * width + x) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      if (brightness > 210 && Math.random() > 0.6) {
        drawSparkleStar(ctx, x, y, 4 + Math.random() * 4);
      }
    }
  }
  ctx.restore();
}

// ----------------------------------------------------------------------
// 6. SOFT AESTHETIC PORTRAIT (Orton Dreamy Glow & Rose Gold)
// ----------------------------------------------------------------------
function applySoftAesthetic(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Orton Effect: Layer 1 is sharp, Layer 2 is blurred and screen-blended
  ctx.save();
  ctx.globalAlpha = 0.38;
  ctx.filter = 'blur(10px) brightness(1.12) contrast(1.05)';
  ctx.globalCompositeOperation = 'screen';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Rose Gold Velvet Tint
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.fillStyle = '#F472B6';
  ctx.globalCompositeOperation = 'soft-light';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Vignette for intimate portrait focus
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.4,
    width / 2,
    height / 2,
    Math.min(width, height) * 0.8
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(40,10,25,0.22)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}

// ----------------------------------------------------------------------
// 7. CHIBI CHARACTER STYLE (High Key, Rosy Cheeks, Micro Charm)
// ----------------------------------------------------------------------
function applyChibiStyle(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Saturated high-key cute look
  ctx.save();
  ctx.filter = 'saturate(1.4) brightness(1.08) contrast(1.08)';
  ctx.drawImage(ctx.canvas, 0, 0);
  ctx.restore();

  // Soft cute blush circles on middle portrait area
  ctx.save();
  ctx.globalAlpha = 0.25;
  const cheekY = height * 0.48;
  const cheekRadius = width * 0.08;

  // Left cheek
  const leftCheek = ctx.createRadialGradient(
    width * 0.38,
    cheekY,
    1,
    width * 0.38,
    cheekY,
    cheekRadius
  );
  leftCheek.addColorStop(0, 'rgba(255, 105, 180, 0.6)');
  leftCheek.addColorStop(1, 'rgba(255, 105, 180, 0)');
  ctx.fillStyle = leftCheek;
  ctx.beginPath();
  ctx.arc(width * 0.38, cheekY, cheekRadius, 0, Math.PI * 2);
  ctx.fill();

  // Right cheek
  const rightCheek = ctx.createRadialGradient(
    width * 0.62,
    cheekY,
    1,
    width * 0.62,
    cheekY,
    cheekRadius
  );
  rightCheek.addColorStop(0, 'rgba(255, 105, 180, 0.6)');
  rightCheek.addColorStop(1, 'rgba(255, 105, 180, 0)');
  ctx.fillStyle = rightCheek;
  ctx.beginPath();
  ctx.arc(width * 0.62, cheekY, cheekRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Subtle clean cartoon contours
  const contour = document.createElement('canvas');
  contour.width = width;
  contour.height = height;
  const cc = contour.getContext('2d')!;
  cc.drawImage(ctx.canvas, 0, 0);
  applySobelEdges(cc, width, height, 0.2);

  ctx.save();
  ctx.globalAlpha = 0.24;
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(contour, 0, 0);
  ctx.restore();
}

// ----------------------------------------------------------------------
// 8. PROFESSIONAL PHOTO ENHANCEMENT (Magazine Polish, Clarity & Curves)
// ----------------------------------------------------------------------
function applyProEnhance(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Auto dynamic range stretch + vibrance
  let minLum = 255;
  let maxLum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (lum < minLum) minLum = lum;
    if (lum > maxLum) maxLum = lum;
  }

  const range = Math.max(1, maxLum - minLum);

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Contrast stretch
    r = ((r - minLum) / range) * 255;
    g = ((g - minLum) / range) * 255;
    b = ((b - minLum) / range) * 255;

    // Vibrance (selective saturation boost for muted tones)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const sat = (maxVal - minVal) / (maxVal || 1);
    const boost = (1 - sat) * 0.22;

    const avg = (r + g + b) / 3;
    r = r + (r - avg) * boost;
    g = g + (g - avg) * boost;
    b = b + (b - avg) * boost;

    // Pleasant golden highlight warmth
    if (r > 160) r = r * 1.03;
    if (g > 160) g = g * 1.01;

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  ctx.putImageData(imgData, 0, 0);

  // Subtle studio vignette
  ctx.save();
  const vig = ctx.createRadialGradient(
    width / 2,
    height / 2,
    Math.min(width, height) * 0.5,
    width / 2,
    height / 2,
    Math.min(width, height) * 0.95
  );
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

// ----------------------------------------------------------------------
// HELPER UTILITIES: Sobel Edge Detector, Fast Blur, Sparkle Star
// ----------------------------------------------------------------------

function applyAdaptiveInkLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  threshold = 0.30
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const rawGray = new Float32Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    rawGray[p] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  }

  // 3x3 Gaussian smoothing pass to eliminate noise specks on skin & backgrounds
  const gray = new Float32Array(width * height);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      gray[idx] =
        (rawGray[idx - width - 1] * 1 +
          rawGray[idx - width] * 2 +
          rawGray[idx - width + 1] * 1 +
          rawGray[idx - 1] * 2 +
          rawGray[idx] * 4 +
          rawGray[idx + 1] * 2 +
          rawGray[idx + width - 1] * 1 +
          rawGray[idx + width] * 2 +
          rawGray[idx + width + 1] * 1) /
        16;
    }
  }

  const out = ctx.createImageData(width, height);
  const oData = out.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const gx =
        -gray[idx - width - 1] +
        gray[idx - width + 1] -
        2 * gray[idx - 1] +
        2 * gray[idx + 1] -
        gray[idx + width - 1] +
        gray[idx + width + 1];

      const gy =
        -gray[idx - width - 1] -
        2 * gray[idx - width] -
        gray[idx - width + 1] +
        gray[idx + width - 1] +
        2 * gray[idx + width] +
        gray[idx + width + 1];

      const mag = Math.sqrt(gx * gx + gy * gy);
      const p4 = idx * 4;

      if (mag > threshold) {
        // Crisp smooth comic ink contour
        const inkStrength = Math.min(240, Math.round((mag - threshold) * 450));
        const val = Math.max(15, 255 - inkStrength);
        oData[p4] = val;
        oData[p4 + 1] = val;
        oData[p4 + 2] = val;
        oData[p4 + 3] = 255;
      } else {
        oData[p4] = 255;
        oData[p4 + 1] = 255;
        oData[p4 + 2] = 255;
        oData[p4 + 3] = 255;
      }
    }
  }

  ctx.putImageData(out, 0, 0);
}

function applySobelEdges(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  edgeThreshold = 0.2
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const gray = new Float32Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    gray[p] = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
  }

  const out = ctx.createImageData(width, height);
  const oData = out.data;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      // Sobel kernel X
      const gx =
        -gray[idx - width - 1] +
        gray[idx - width + 1] -
        2 * gray[idx - 1] +
        2 * gray[idx + 1] -
        gray[idx + width - 1] +
        gray[idx + width + 1];

      // Sobel kernel Y
      const gy =
        -gray[idx - width - 1] -
        2 * gray[idx - width] -
        gray[idx - width + 1] +
        gray[idx + width - 1] +
        2 * gray[idx + width] +
        gray[idx + width + 1];

      const mag = Math.sqrt(gx * gx + gy * gy);
      const isEdge = mag > edgeThreshold;

      const p4 = idx * 4;
      if (isEdge) {
        const edgeDark = Math.max(0, 255 - Math.round(mag * 255 * 1.5));
        oData[p4] = edgeDark;
        oData[p4 + 1] = edgeDark;
        oData[p4 + 2] = edgeDark;
        oData[p4 + 3] = 255;
      } else {
        oData[p4] = 255;
        oData[p4 + 1] = 255;
        oData[p4 + 2] = 255;
        oData[p4 + 3] = 255;
      }
    }
  }

  ctx.putImageData(out, 0, 0);
}

function fastBlurGray(
  src: Uint8Array,
  width: number,
  height: number,
  radius: number
): Uint8Array {
  const dest = new Uint8Array(src.length);
  // Horizontal pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let count = 0;
      for (let k = -radius; k <= radius; k++) {
        const nx = x + k;
        if (nx >= 0 && nx < width) {
          sum += src[y * width + nx];
          count++;
        }
      }
      dest[y * width + x] = Math.round(sum / count);
    }
  }
  // Vertical pass
  const dest2 = new Uint8Array(src.length);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let sum = 0;
      let count = 0;
      for (let k = -radius; k <= radius; k++) {
        const ny = y + k;
        if (ny >= 0 && ny < height) {
          sum += dest[ny * width + x];
          count++;
        }
      }
      dest2[y * width + x] = Math.round(sum / count);
    }
  }
  return dest2;
}

function drawSparkleStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy + radius);
  ctx.quadraticCurveTo(cx, cy, cx - radius, cy);
  ctx.quadraticCurveTo(cx, cy, cx, cy - radius);
  ctx.fill();
}
