import type { TrackType } from '@/data/tracks';

const ASCII_RAMP = ' .\'`^",:;Il!i~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

const trackProfiles: Record<TrackType, { contrast: number; phase: number; drift: number }> = {
  release: { contrast: 1.15, phase: 0.9, drift: 0.18 },
  live: { contrast: 1.35, phase: 1.7, drift: 0.32 },
  unreleased: { contrast: 0.88, phase: 2.4, drift: 0.11 },
  mix: { contrast: 1.05, phase: 3.1, drift: 0.24 },
};

interface ImageToAsciiOptions {
  width?: number;
  contrast?: number;
  charAspect?: number;
  invert?: boolean;
  ramp?: string;
}

function clamp(value: number, min = 0, max = 255) {
  return Math.min(max, Math.max(min, value));
}

function applyContrast(value: number, amount: number) {
  const contrast = clamp(amount, -255, 255);
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  return clamp(factor * (value - 128) + 128);
}

function charFromLuminance(luminance: number, ramp = ASCII_RAMP, invert = false) {
  const normalized = clamp(luminance) / 255;
  const density = invert ? normalized : 1 - normalized;
  const index = Math.round(density * (ramp.length - 1));

  return ramp[index] ?? ' ';
}

function hashSeed(seed: string) {
  return seed.split('').reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 9973, 17);
}

export function imageDataToAscii(imageData: ImageData, options: ImageToAsciiOptions = {}) {
  const width = options.width ?? 100;
  const contrast = options.contrast ?? 70;
  const charAspect = options.charAspect ?? 0.45;
  const ramp = options.ramp ?? ASCII_RAMP;
  const sourceWidth = imageData.width;
  const sourceHeight = imageData.height;
  const height = Math.max(1, Math.round((sourceHeight / sourceWidth) * width * charAspect));
  const cellWidth = sourceWidth / width;
  const cellHeight = sourceHeight / height;
  let art = '';

  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const startX = Math.floor(col * cellWidth);
      const endX = Math.max(startX + 1, Math.floor((col + 1) * cellWidth));
      const startY = Math.floor(row * cellHeight);
      const endY = Math.max(startY + 1, Math.floor((row + 1) * cellHeight));
      let total = 0;
      let count = 0;

      for (let y = startY; y < endY; y += 1) {
        for (let x = startX; x < endX; x += 1) {
          const pixel = (y * sourceWidth + x) * 4;
          const r = imageData.data[pixel] ?? 0;
          const g = imageData.data[pixel + 1] ?? 0;
          const b = imageData.data[pixel + 2] ?? 0;
          const alpha = (imageData.data[pixel + 3] ?? 255) / 255;
          const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) * alpha + 255 * (1 - alpha);

          total += luminance;
          count += 1;
        }
      }

      art += charFromLuminance(applyContrast(total / count, contrast), ramp, options.invert);
    }

    art += '\n';
  }

  return art;
}

export function genTrackArt(id: string, type: TrackType, rows = 8, cols = 26) {
  const profile = trackProfiles[type] ?? trackProfiles.release;
  const seed = hashSeed(id);
  const centerX = cols * (0.35 + ((seed % 17) / 100));
  const centerY = rows * (0.42 + ((seed % 11) / 100));
  let art = '';

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const dx = (col - centerX) / cols;
      const dy = (row - centerY) / rows;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const wave = Math.sin((col * profile.drift + row * 0.41 + seed) * profile.phase);
      const diagonal = Math.cos((col - row + seed) * 0.19);
      const luminance = clamp(255 * (0.22 + distance * profile.contrast + wave * 0.13 + diagonal * 0.08));

      art += charFromLuminance(luminance, ASCII_RAMP);
    }
    art += '\n';
  }

  return art;
}
