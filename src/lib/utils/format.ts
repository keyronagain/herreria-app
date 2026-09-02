const crcFormatter = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-CR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCRC(value: number): string {
  return crcFormatter.format(value);
}

export function formatNumber(value: number, decimals = 2): string {
  if (decimals === 2) return numberFormatter.format(value);
  return new Intl.NumberFormat('es-CR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatMedida(cm: number): string {
  if (cm >= 100) return `${formatNumber(cm / 100, 2)} m`;
  return `${formatNumber(cm, 2)} cm`;
}

export function parseNumero(value: string): number {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function cmToM(cm: number): number {
  return cm / 100;
}

export function mToCm(m: number): number {
  return m * 100;
}
