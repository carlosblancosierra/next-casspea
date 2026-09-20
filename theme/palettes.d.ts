/**
 * Types for theme/palettes.js. The source stays plain CommonJS because
 * tailwind.config.js has to require() it at build time, so the shape is
 * declared here instead.
 */
export interface Palette {
    name: string;
    description: string;
    colors: Record<string, string>;
    gradients: Record<string, string>;
}

export declare const palettes: Record<string, Palette>;
export declare const ACTIVE: string;
export declare const active: Palette;
