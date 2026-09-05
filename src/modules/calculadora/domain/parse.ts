import type { ParseResult } from './types';

const HAS_LETTER = /[a-zA-Z]/;
const HAS_PLUS = /\+/;
const DECIMAL_PATTERN = /^-?(\d+[.,]\d+|\d+|[.,]\d+)$/;
const INTEGER_PATTERN = /^-?\d+$/;

function normalizeRaw(raw: string): string {
  return raw.trim();
}

function hasAmbiguousSeparators(value: string): boolean {
  return value.includes(',') && value.includes('.');
}

function hasMixedSigns(value: string): boolean {
  if (HAS_PLUS.test(value)) {
    return true;
  }

  const minusCount = (value.match(/-/g) ?? []).length;
  if (minusCount === 0) {
    return false;
  }

  return minusCount > 1 || !value.startsWith('-');
}

function toFiniteNumber(normalized: string): ParseResult {
  const asDot = normalized.replace(',', '.');
  const value = Number(asDot);

  if (!Number.isFinite(value)) {
    return { ok: false, reason: 'invalid' };
  }

  return { ok: true, value };
}

function rejectCommonInvalid(raw: string): ParseResult | null {
  const normalized = normalizeRaw(raw);

  if (normalized === '') {
    return { ok: false, reason: 'empty' };
  }

  if (
    HAS_LETTER.test(normalized) ||
    hasAmbiguousSeparators(normalized) ||
    hasMixedSigns(normalized) ||
    normalized === '-' ||
    normalized === ',' ||
    normalized === '.'
  ) {
    return { ok: false, reason: 'invalid' };
  }

  return null;
}

export function parseDecimal(raw: string): ParseResult {
  const common = rejectCommonInvalid(raw);
  if (common) {
    return common;
  }

  const normalized = normalizeRaw(raw);
  if (!DECIMAL_PATTERN.test(normalized)) {
    return { ok: false, reason: 'invalid' };
  }

  return toFiniteNumber(normalized);
}

export function parseInteger(raw: string): ParseResult {
  const common = rejectCommonInvalid(raw);
  if (common) {
    return common;
  }

  const normalized = normalizeRaw(raw);
  if (!INTEGER_PATTERN.test(normalized)) {
    return { ok: false, reason: 'invalid' };
  }

  return toFiniteNumber(normalized);
}
