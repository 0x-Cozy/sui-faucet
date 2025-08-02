export const TABS = {
  SUI: 'sui',
  REFUND: 'refund'
} as const;
//TODO
export const SLIDER_DEFAULTS = {
  INITIAL_VALUE: 40,
  MIN_VALUE: 0,
  MAX_VALUE: 100
} as const;

export const THUNDER_THRESHOLD = 80;

export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/',
  TWITTER: 'https://twitter.com/',
  DISCORD: 'https://discord.com/'
} as const;

//export const HCAPTCHA_SITEKEY = '10000000-ffff-ffff-ffff-000000000001';

if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error('VITE_BACKEND_URL is not set');
}

if (!import.meta.env.VITE_REFUND_ADDRESS) {
  throw new Error('VITE_REFUND_ADDRESS is not set');
}
if (!import.meta.env.VITE_HCAPTCHA_KEY) {
  throw new Error('VITE_HCAPTCHA_KEY is not set');
}

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const REFUND_ADDRESS = import.meta.env.VITE_REFUND_ADDRESS;
export const HCAPTCHA_SITEKEY = import.meta.env.VITE_HCAPTCHA_KEY;
