/// <reference types="vite/client" />

import 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}

interface ImportMetaEnv {
  readonly VITE_LEMONSQUEEZY_STORE_ID?: string;
  readonly VITE_LEMONSQUEEZY_PRODUCT_VARIANT_ID?: string;
  readonly VITE_BUTTONDOWN_USERNAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url: { Open: (url: string) => void };
      Setup: (opts: { eventHandler?: (event: { event: string }) => void }) => void;
    };
  }
}
