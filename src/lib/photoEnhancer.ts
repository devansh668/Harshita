import { loadImage } from './cartoonShader';

export interface EnhancementParams {
  brightness: number; // -100 to 100 (0 default)
  contrast: number; // -100 to 100 (0 default)
  saturation: number; // -100 to 100 (0 default)
  blur: number; // 0 to 20 px
  bgBlur: number; // 0 to 25 px (radial mask)
  temperature: number; // -100 (cool) to 100 (warm)
  vintage: number; // 0 to 100%
  blackWhite: number; // 0 to 100%
  softGlow: number; // 0 to 100%
}

export const DEFAULT_ENHANCEMENT: EnhancementParams = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  bgBlur: 0,
  temperature: 0,
  vintage: 0,
  blackWhite: 0,
  softGlow: 0,
};

export interface FilterPreset {
  name: string;
  params: EnhancementParams;
}

export const PRESET_FILTERS: Record<string, EnhancementParams> = {
  'Natural Original': { ...DEFAULT_ENHANCEMENT },
  'Golden Hour': {
    brightness: 8,
    contrast: 12,
    saturation: 18,
    blur: 0,
    bgBlur: 6,
    temperature: 35,
    vintage: 10,
    blackWhite: 0,
    softGlow: 25,
  },
  'Dreamy Glow': {
    brightness: 12,
    contrast: -5,
    saturation: 10,
    blur: 0,
    bgBlur: 10,
    temperature: 15,
    vintage: 0,
    blackWhite: 0,
    softGlow: 65,
  },
  'Rose Quartz': {
    brightness: 10,
    contrast: 8,
    saturation: 14,
    blur: 0,
    bgBlur: 4,
    temperature: 20,
    vintage: 15,
    blackWhite: 0,
    softGlow: 40,
  },
  'Vintage Film': {
    brightness: -4,
    contrast: 22,
    saturation: -15,
    blur: 0,
    bgBlur: 8,
    temperature: 28,
    vintage: 60,
    blackWhite: 0,
    softGlow: 15,
  },
  'Noir Elegance': {
    brightness: 5,
    contrast: 35,
    saturation: -100,
    blur: 0,
    bgBlur: 12,
    temperature: 0,
    vintage: 0,
    blackWhite: 100,
    softGlow: 20,
  },
  'Sunset Romance': {
    brightness: 14,
    contrast: 15,
    saturation: 30,
    blur: 0,
    bgBlur: 8,
    temperature: 45,
    vintage: 12,
    blackWhite: 0,
    softGlow: 35,
  },
};

/**
 * Apply real-time visual adjustments and filters to a photo
 */
export async function renderEnhancedPhoto(
  src: string | HTMLImageElement,
  params: EnhancementParams
): Promise<string> {
  const img = typeof src === 'string' ? await loadImage(src) : src;

  const canvas = document.createElement('canvas');
  const width = img.naturalWidth || img.width || 800;
  const height = img.naturalHeight || img.height || 1000;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get 2D context');

  // 1. Draw base photo
  ctx.drawImage(img, 0, 0, width, height);

  // 2. Background Blur (Depth-of-field portrait effect)
  if (params.bgBlur > 0) {
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = width;
    blurCanvas.height = height;
    const bCtx = blurCanvas.getContext('2d')!;
    bCtx.filter = `blur(${params.bgBlur}px)`;
    bCtx.drawImage(canvas, 0, 0);

    // Create radial mask leaving center subject sharp
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = width;
    maskCanvas.height = height;
    const mCtx = maskCanvas.getContext('2d')!;
    const maskGrad = mCtx.createRadialGradient(
      width / 2,
      height * 0.45,
      Math.min(width, height) * 0.22,
      width / 2,
      height * 0.45,
      Math.min(width, height) * 0.55
    );
    maskGrad.addColorStop(0, 'rgba(0,0,0,0)');
    maskGrad.addColorStop(1, 'rgba(0,0,0,1)');
    mCtx.fillStyle = maskGrad;
    mCtx.fillRect(0, 0, width, height);

    bCtx.globalCompositeOperation = 'destination-in';
    bCtx.drawImage(maskCanvas, 0, 0);

    ctx.drawImage(blurCanvas, 0, 0);
  }

  // 3. Pixel-level adjustments (Brightness, Contrast, Saturation, Temperature, Vintage, B&W)
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const bFactor = params.brightness * 1.5; // -150 to 150
  const cFactor = (params.contrast + 100) / 100; // 0 to 2
  const sFactor = (params.saturation + 100) / 100; // 0 to 2
  const temp = params.temperature / 100; // -1 to 1
  const vintage = params.vintage / 100; // 0 to 1
  const bw = params.blackWhite / 100; // 0 to 1

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    r += bFactor;
    g += bFactor;
    b += bFactor;

    // Contrast
    r = (r - 128) * cFactor + 128;
    g = (g - 128) * cFactor + 128;
    b = (b - 128) * cFactor + 128;

    // Saturation
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = gray + (r - gray) * sFactor;
    g = gray + (g - gray) * sFactor;
    b = gray + (b - gray) * sFactor;

    // Temperature (Warm vs Cool)
    if (temp > 0) {
      r += temp * 32;
      b -= temp * 22;
    } else if (temp < 0) {
      b += Math.abs(temp) * 32;
      r -= Math.abs(temp) * 22;
    }

    // Vintage Sepia Tone
    if (vintage > 0) {
      const vr = r * 0.393 + g * 0.769 + b * 0.189;
      const vg = r * 0.349 + g * 0.686 + b * 0.168;
      const vb = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - vintage) + vr * vintage;
      g = g * (1 - vintage) + vg * vintage;
      b = b * (1 - vintage) + vb * vintage;
    }

    // Black & White (Monochrome)
    if (bw > 0) {
      r = r * (1 - bw) + gray * bw;
      g = g * (1 - bw) + gray * bw;
      b = b * (1 - bw) + gray * bw;
    }

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
  ctx.putImageData(imgData, 0, 0);

  // 4. Soft Glow (Dreamy Bloom overlay)
  if (params.softGlow > 0) {
    const glowAlpha = (params.softGlow / 100) * 0.55;
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    ctx.filter = 'blur(12px) brightness(1.2) contrast(1.1)';
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }

  // 5. Global Blur
  if (params.blur > 0) {
    const gBlurCanvas = document.createElement('canvas');
    gBlurCanvas.width = width;
    gBlurCanvas.height = height;
    const gbCtx = gBlurCanvas.getContext('2d')!;
    gbCtx.filter = `blur(${params.blur}px)`;
    gbCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(gBlurCanvas, 0, 0);
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}
