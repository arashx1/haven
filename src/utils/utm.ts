/**
 * UTM & Campaign Attribution Tracker
 * Automatically captures and persists marketing campaign parameters
 * (utm_source, utm_medium, utm_campaign, utm_term, utm_content, ref)
 */

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
  landing_url?: string;
  timestamp?: string;
}

const UTM_STORAGE_KEY = 'haven_utm_params';

export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    const ref = urlParams.get('ref');

    // Only store if at least one parameter is present in current URL
    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent || ref) {
      const captured: UtmParams = {
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_term: utmTerm || undefined,
        utm_content: utmContent || undefined,
        ref: ref || undefined,
        landing_url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      console.info('[Haven UTM] Captured campaign parameters:', captured);
      return captured;
    }

    // Return previously saved if present
    const saved = localStorage.getItem(UTM_STORAGE_KEY) || sessionStorage.getItem(UTM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as UtmParams;
    }
  } catch (err) {
    console.warn('[Haven UTM] Failed to read UTM parameters:', err);
  }

  return null;
}

export function getStoredUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(UTM_STORAGE_KEY) || sessionStorage.getItem(UTM_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as UtmParams) : null;
  } catch {
    return null;
  }
}
