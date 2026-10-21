/**
 * Item 14 – UTM Tracking
 *
 * Reads UTM parameters from the URL on page load and persists them to
 * localStorage so that they survive navigation within the SPA and can
 * be attached to any analytics / conversion events.
 *
 * Usage:
 *   import { initUtmTracking, getStoredUtmParams } from '@/utils/utmTracking';
 *
 *   // Call once at app start:
 *   initUtmTracking();
 *
 *   // Read at any time:
 *   const utms = getStoredUtmParams();
 *   // → { utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'haven-launch', ... }
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY = 'haven_utm_params';

/** Parse UTM params from the current URL search string. */
function parseUtmFromUrl(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  const result: UtmParams = {};
  const keys: (keyof UtmParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ];
  for (const key of keys) {
    const val = params.get(key);
    if (val) result[key] = val;
  }
  return result;
}

/**
 * Call this once when the app mounts. If UTM params are present in the
 * URL they overwrite any previously stored values so that the latest
 * acquisition source is always tracked.
 */
export function initUtmTracking(): void {
  const utms = parseUtmFromUrl();
  if (Object.keys(utms).length > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
      // Clean UTM params from the URL without a page reload (keeps history tidy)
      const url = new URL(window.location.href);
      const keysToDelete: (keyof UtmParams)[] = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
      ];
      keysToDelete.forEach((k) => url.searchParams.delete(k));
      window.history.replaceState({}, '', url.toString());
    } catch {
      // localStorage might not be available; silently continue
    }
  }
}

/** Retrieve the most recently persisted UTM params. */
export function getStoredUtmParams(): UtmParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UtmParams;
  } catch {
    // ignore
  }
  return {};
}
