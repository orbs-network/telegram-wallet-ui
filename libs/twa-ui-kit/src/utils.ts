function hexToRgbArray(hex: string): number[] {
  const hexCode = hex.replace('#', '');
  const r = parseInt(hexCode.substring(0, 2), 16);
  const g = parseInt(hexCode.substring(2, 4), 16);
  const b = parseInt(hexCode.substring(4, 6), 16);
  return [r, g, b];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  return `#${hexR}${hexG}${hexB}`;
}

export function hexToRgb(hex: string): string {
  const rgb = hexToRgbArray(hex);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function hexToRgba(hex: string, alpha: number): string {
  const rgb = hexToRgbArray(hex);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function adjustBrightness(hex: string, brightness = 0): string {
  const rgb = hexToRgbArray(hex);
  const increment = Math.round(brightness * 255);

  const hexValues = rgb.map((value) => {
    return Math.max(Math.min(value + increment, 255), 0);
  });

  return rgbToHex(hexValues[0], hexValues[1], hexValues[2]);
}
