// Helper para Google Tag Manager
// Reemplaza 'GTM-XXXXXXX' por tu ID real si llamas initGTM sin parámetros.

type DataLayerEvent = {
  event: string;
  [key: string]: any;
};

const DEFAULT_CONTAINER = 'GTM-54H2TFM7';

export function initGTM(containerId: string = DEFAULT_CONTAINER) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  ;(window as any).dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

  // if script already present, skip
  if (document.querySelector("script[src*='googletagmanager.com/gtm.js']")) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
  document.head.appendChild(script);
}

export function pushEvent(event: DataLayerEvent) {
  if (typeof window === 'undefined') return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(event);
}

export default { initGTM, pushEvent };
