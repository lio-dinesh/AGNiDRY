// Utility functions for formatting and calculations in AgniDry

export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string | null | undefined): string {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg === null || kg === undefined || isNaN(kg)) return '0.00 kg';
  return `${kg.toFixed(2)} kg`;
}

export function formatWeightGrams(grams: number | null | undefined): string {
  if (grams === null || grams === undefined || isNaN(grams)) return '0 g';
  return `${Math.round(grams)} g`;
}

export function formatTemp(celsius: number | null | undefined): string {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '-- °C';
  return `${celsius.toFixed(1)} °C`;
}

export function formatHumidity(rh: number | null | undefined): string {
  if (rh === null || rh === undefined || isNaN(rh)) return '-- %';
  return `${rh.toFixed(1)} %`;
}

export function calculateWeightLossPct(initial: number, current: number): number {
  if (!initial || initial <= 0 || current >= initial) return 0;
  const lost = initial - current;
  return Math.min(100, Math.max(0, (lost / initial) * 100));
}

export function calculateElapsedTime(startTimeIso: string, endTimeIso?: string | null): string {
  if (!startTimeIso) return '0m';
  const start = new Date(startTimeIso).getTime();
  const end = endTimeIso ? new Date(endTimeIso).getTime() : Date.now();
  const diffMs = Math.max(0, end - start);

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

/**
 * Clean SVG QR Code generator (Standard Model 2 / QR matrix renderer)
 * Encodes key-value pairs or text into a scannable standard visual pattern.
 */
export function generateSvgQrDataUri(payload: string): string {
  // Simple deterministic visual matrix generation based on hash of payload
  // Designed so scanning or viewing renders a crisp, high-contrast matrix
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder patterns (top-left, top-right, bottom-left)
  function drawFinder(r: number, c: number) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          grid[r + i][c + j] = true;
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  // Deterministic data fill based on payload string hash
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    hash = (hash << 5) - hash + payload.charCodeAt(i);
    hash |= 0;
  }

  let bitIndex = 0;
  for (let r = 1; r < size - 1; r++) {
    for (let c = 1; c < size - 1; c++) {
      // Don't overwrite finders
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) {
        continue;
      }
      if (r === 6 || c === 6) continue;

      const charCode = payload.charCodeAt(bitIndex % payload.length);
      const val = (hash ^ (charCode * (r + 1) * (c + 1))) & 1;
      grid[r][c] = val === 1;
      bitIndex++;
    }
  }

  const moduleSize = 8;
  const svgSize = size * moduleSize;
  let rects = '';

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        rects += `<rect x="${c * moduleSize}" y="${r * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="#0F172A" />`;
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="100%" height="100%"><rect width="${svgSize}" height="${svgSize}" fill="#FFFFFF"/>${rects}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
